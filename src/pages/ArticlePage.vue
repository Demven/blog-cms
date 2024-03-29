<template>
  <div class="ArticlePage">
    <SvgSprite></SvgSprite>
    <Nav
      :title="article.title"
      @publish="onPublish"
      @preview="onPreview"
    ></Nav>

    <div class="ArticlePage__main">
      <div class="ArticlePage__input-field">
        <TextField
          :name="'title'"
          :label="'Headline'"
          :placeholder="'Title'"
          :value="article.title"
          required
          @change="onFieldChange"
        ></TextField>
      </div>

      <div class="ArticlePage__input-field ArticlePage__hero-image-field">
        <TextField
          :name="'mainImageUrl'"
          :label="'Main Image'"
          :placeholder="'Url'"
          :value="article.image.url"
          required
          @change="onMainImageChange"
        ></TextField>

        <img
          class="ArticlePage__hero-image"
          :src="heroImageUrl"
          v-if="article.image.url"
        />
      </div>

      <div class="ArticlePage__input-field">
        <TextArea
          :key="'description_' + article.slug"
          :name="'description'"
          :label="'Description'"
          :rows="4"
          :placeholder="'Description'"
          :initial-value="article.description"
          required
          @change="onFieldChange"
        ></TextArea>
      </div>

      <div class="ArticlePage__input-field">
        <SelectField
          :name="'category'"
          :label="'Category'"
          :selectedIndex="categoryIndex"
          :values="categories"
          @select="onCategoryChange"
        ></SelectField>
      </div>

      <div class="ArticlePage__input-field">
        <AutoComplete
          :name="'keyword'"
          :label="'Keywords'"
          :placeholder="'Start typing to choose a keyword'"
          :value="keyword"
          :items="suggestedKeywords"
          required
          @change="onKeywordChange"
          @select="onKeywordSelect"
          @enter="onCreateKeyword"
        ></AutoComplete>

        <ul class="ArticlePage__keywords">
          <li
            class="ArticlePage__keyword"
            v-for="(keyword, index) in article.keywords"
            :key="index"
          >
            <span class="ArticlePage__text">{{keyword.name}}</span>
            <button
              class="ArticlePage__remove-keyword"
              @click="onRemoveKeyword(index)"
            >
              <Icon :name="ICON_CLOSE"></Icon>
            </button>
          </li>
        </ul>
      </div>

      <ArticleBody
        :nodes="body"
        @update="onBodyContentUpdate"
        @remove="onBodyContentRemove"
        @add-content="onAddContent"
      ></ArticleBody>

      <InsertContent
        :index="body.length"
        @add-content="onAddContent"
      ></InsertContent>
    </div>

    <Toast :event-bus="toastEventBus"></Toast>
  </div>
</template>

<script>
  import emitter from 'mitt';
  import SvgSprite from '../components/SvgSprite.vue';
  import Nav from '../components/Nav.vue';
  import Toast from '../components/Toast.vue';
  import TextField from '../components/TextField';
  import TextArea from '../components/TextArea';
  import SelectField from '../components/SelectField';
  import AutoComplete from '../components/AutoComplete';
  import Icon from '../components/Icon/Icon';
  import { ICON } from '../components/Icon/icons';
  import InsertContent from '../components/InsertContent';
  import ArticleBody from '../components/ArticleBody/ArticleBody';
  import { getCroppedImageUrl, ASPECT_RATIO } from '../services/images-service';
  import clientStorage, { STORAGE_KEY } from '../services/client-storage';
  import { gqlQuery, gqlMutation, serializeGQLObject } from '../services/gql-service';
  import { uuid } from '../services/uuid-service';
  import { env } from '../env';

  const DEFAULT_ARTICLE = {
    slug: '',
    title: '',
    description: '',
    image: {
      url: '',
      description: '',
      credits: '',
    },
    category: {
      title: '', // text
      slug: '', // value
      color: '',
      _v: 0,
      _id: '',
    },
    keywords: [],
    views: {
      count: 0,
    },
    publication_date: '',
    body: [],
  };

  export default {
    name: 'HomePage',
    components: {
      AutoComplete,
      SelectField,
      TextField,
      TextArea,
      SvgSprite,
      Nav,
      Toast,
      Icon,
      InsertContent,
      ArticleBody,
    },
    data () {
      return {
        slug: '',
        article: DEFAULT_ARTICLE,
        body: [],
        categories: [],
        categoryIndex: 0,
        keyword: '',
        suggestedKeywords: [],
        createMode: false,
        toastEventBus: emitter(),
        ICON_CLOSE: ICON.CLOSE,
      };
    },
    computed: {
      heroImageUrl () {
        return getCroppedImageUrl(this.article.image.url, ASPECT_RATIO.w16h9);
      },
    },
    created () {
      this.slug = this.$route.params.slug;

      if (this.slug) {
        this.createMode = false;
        this.fetchArticle()
          .then(this.fetchCategories);
      } else {
        this.createMode = true;
        this.fetchCategories();
      }
    },
    methods: {
      fetchArticle() {
        return gqlQuery(`
          article (slug: "${this.slug}", ignorePageView: true) {
            _id
            slug
            title
            description
            image {
              _id
              url
              description
              credits
            }
            category {
              _id
              title
              slug
              color
            }
            keywords {
              _id
              slug
              name
            }
            body
            deleted
            publication_date
            last_updated
          }
        `)
          .then(data => {
            if (data?.article) {
              this.article = data.article;
              // each body node should have a unique id so that we could assign correct keys in v-for
              this.body = [...this.article.body].map(node => ({ ...node, id: uuid() }));
            } else {
              console.error('Could not get article data', data);
              this.toastEventBus.emit('message', 'Could not get article data');
            }
          })
          .catch(error => {
            console.error(error);
            this.toastEventBus.emit('message', 'Could not get article data');
          });
      },

      fetchCategories () {
        return gqlQuery(`
          categories {
            _id
            title
            slug
            color
          }
        `)
          .then(data => {
            if (data?.categories?.length) {
              this.categories = data.categories.map(category => ({
                ...category,
                text: category.title,
                value: category.slug,
              }));

              if (this.createMode) {
                this.article.category = data.categories[0];
              } else {
                this.categoryIndex = this.categories.findIndex(category => category.value === this.article.category.slug);
              }
            } else {
              console.error('Could not get categories data', data);
              this.toastEventBus.emit('message', 'Could not fetch existing categories');
            }
          })
          .catch(error => {
            console.error(error);
            this.toastEventBus.emit('message', 'Could not fetch existing categories');
          });
      },

      fetchSuggestedKeywords (keywordFragment) {
        return gqlQuery(`
          keywords (search: "${encodeURIComponent(keywordFragment)}", limit: 5) {
            _id
            name
            slug
          }
        `)
          .then(data => {
            if (data?.keywords) {
              this.suggestedKeywords = data.keywords.map(keyword => ({
                ...keyword,
                text: keyword.name,
                value: keyword.slug,
              }));
            } else {
              console.error('Could not get keywords data', data);
              this.toastEventBus.emit('message', 'Could not fetch suggested keywords');
            }
          })
          .catch(error => {
            console.error(error);
            this.toastEventBus.emit('message', 'Could not fetch suggested keywords');
          });
      },

      onFieldChange ({ name, value }) {
        if (name) {
          this.article[name] = value;
        }
      },

      onMainImageChange ({ name, value }) {
        if (name) {
          this.article.image = { url: value, description: '', credits: '' };
        }
      },

      onCategoryChange (selectedIndex) {
        this.categoryIndex = Number(selectedIndex);
        this.article.category = {
          ...this.categories[selectedIndex],
          text: undefined,
          value: undefined,
        };
      },

      onKeywordChange({ name, value }) {
        if (name === 'keyword') {
          this.keyword = value;

          this.fetchSuggestedKeywords(value);
        }
      },

      onKeywordSelect({ name, selectedIndex }) {
        if (name === 'keyword') {
          const selectedKeyword = {
            ...this.suggestedKeywords[selectedIndex],
            text: undefined,
            value: undefined,
          };

          this.keyword = '';
          this.article.keywords.push(selectedKeyword);
        }
      },

      onCreateKeyword({ name, value }) {
        if (name === 'keyword') {
          gqlMutation(`
            createKeyword (name: "${value}") {
              _id
              name
              slug
            }
          `)
            .then(data => {
              if (data?.createKeyword) {
                this.article.keywords.push(data.createKeyword);
                this.keyword = '';
              } else {
                console.error('Failed to create keyword', data);
                this.toastEventBus.emit('message', 'Failed to create keyword');
              }
            })
            .catch(error => {
              console.error('Failed to create keyword', value, error);
              this.toastEventBus.emit('message', 'Failed to create keyword');
            });
        }
      },

      onRemoveKeyword (index) {
        this.article.keywords.splice(index, 1);
      },

      onBodyContentUpdate ({ index, content }) {
        if (index && content) {
          this.article.body[+index] = content;
          this.body[+index] = content;
        }
      },

      onBodyContentRemove ({ index }) {
        if (index) {
          this.article.body.splice(+index, 1);
          this.body.splice(+index, 1);
        }
      },

      onAddContent ({ index, bodyNode }) {
        const bodyNodeWithCategory = {
          ...bodyNode,
          category: this.article.category,
        };

        this.article.body.splice(index, 0, bodyNodeWithCategory); // insert bodyNode at certain position
        this.body.splice(index, 0, { ...bodyNodeWithCategory }); // add unique id to the new node
      },

      onPublish () {
        const mutationName = this.createMode ? 'createArticle' : 'updateArticle';

        gqlMutation(`
          ${mutationName} (article: ${serializeGQLObject(this.article)}) {
            slug
          }
        `)
          .then(data => {
            if (data && data[mutationName]) {
              this.toastEventBus.emit('message', 'Successfully published');

              if (this.createMode) {
                const articleSlug = data[mutationName].slug;

                this.$router.push(`/article/${articleSlug}`);
              } else {
                this.$router.push(`/article/${this.article.slug}`);
              }
            } else {
              console.error('Failed to publish', data);
              this.toastEventBus.emit('message', 'Failed to publish the article');
            }
          })
          .catch(error => {
            console.error(error);
            this.toastEventBus.emit('message', 'Failed to publish the article');
          });
      },

      onPreview () {
        clientStorage.save(STORAGE_KEY.ARTICLE_DATA, this.article);
        window.open(`${env.WWW_HOST}/article/preview`, '_blank');
      },
    }
  };
</script>

<style lang="scss">
  @import '../styles/colors';
  @import '../styles/media';
  @import '../styles/typography';

  .ArticlePage {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(0, 0, 0, 0.02);

    &__main {
      width: 860px;
      min-height: 100vh;
      margin: 30px 0 60px;
      padding: 30px 60px;
      display: flex;
      flex-direction: column;
      background: $color-white;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.05);
      box-sizing: border-box;
    }

    &__hero-image {
      width: 100%;
      margin-top: 20px;
    }

    &__input-field {
      margin-top: 35px;
    }

    &__keywords {
      padding: 0;
      margin-top: 8px;
      display: flex;
      flex-wrap: wrap;
      list-style: none;
    }

    &__keyword {
      margin-top: 8px;
      margin-right: 8px;
      padding: 4px 6px 5px 10px;
      display: flex;
      align-items: center;
      font-family: $font-dincyr-bold;
      font-size: 16px;
      line-height: 16px;
      text-transform: capitalize;
      border-radius: 4px;
      color: $color-black-medium;
      background: $color-white;
      border: 1px solid #888888;
      cursor: default;
      transition: background 0.3s, color 0.3s, border 0.3s;
    }

    &__remove-keyword {
      -webkit-appearance: none;
      appearance: none;
      width: 18px;
      height: 18px;
      padding: 0;
      margin: 0 0 0 4px;
      outline: none;
      background: none;
      border: none;
      cursor: pointer;
      position: relative;

      & .Icon {
        width: 18px;
        height: 18px;
        color: $color-black-light;
        transition: color 0.3s;

        &:hover {
          color: $color-red;
        }
      }
    }
  }
</style>