<template>
  <div :class="className">
    <div class="HomePageSectionArticle__image-wrapper">
      <img
        class="HomePageSectionArticle__image"
        :src="imageUrl"
        :alt="article.image.description"
      />
    </div>

    <div
       class="HomePageSectionArticle__info"
       v-if="!editMode"
    >
      <h3
         class="HomePageSectionArticle__title"
         title="Edit"
         @click="startEdit"
      >
        {{article.title}}
      </h3>

      <h4
         class="HomePageSectionArticle__slug"
         title="Edit"
         @click="startEdit"
      >
        {{article.slug}}
      </h4>

      <div class="HomePageSectionArticle__metadata">
        <div class="HomePageSectionArticle__publication-date">{{formatPublicationDate}}</div>

        <div class="HomePageSectionArticle__views-count">
          <img
             class="HomePageSectionArticle__views-count-icon"
             src="/images/eye.png"
             alt="Eye icon"
          />
          <div class="HomePageSectionArticle__views-count-value">{{article.views.count}}</div>
        </div>

        <div
           class="HomePageSectionArticle__comments-count"
           v-if="false"
        >
          <img
             class="HomePageSectionArticle__comments-count-icon"
             src="/images/comments.png"
             alt="Comment icon"
          />
          <div class="HomePageSectionArticle__comments-count-value">123</div>
        </div>
      </div>
    </div>

    <div class="HomePageSectionArticle__auto-complete">
      <AutoComplete
        v-if="editMode"
        name="newArticleTitle"
        label="Article Title"
        placeholder="Top 5 things to do with Arduino"
        :value="newArticleTitle"
        :items="newArticleItems"
        required
        @change="onAutoCompleteChange"
        @select="onAutoCompleteSelect"
      ></AutoComplete>
    </div>
  </div>
</template>

<script>
  import classNames from 'classnames';
  import axios from 'axios';
  import moment from 'moment';
  import AutoComplete from './AutoComplete';
  import { env } from '../env';
  import { getCroppedImageUrl, ASPECT_RATIO } from '../services/images-service';

  // interface HomepageSectionArticle {
  //   _id: string;
  //   title: string;
  //   slug: string;
  //   image: {
  //     url: string;
  //     description: string;
  //     credits: string;
  //   };
  //   views: {
  //     count: number;
  //   };
  //   publication_date: string;
  // }

  export default {
    name: 'HomePageSectionArticle',
    props: {
      index: Number,
      article: Object,
      category: Object,
      main: Boolean,
    },
    components: {
      AutoComplete,
    },
    data () {
      return {
        editMode: false,
        newArticleTitle: '',
        newArticleItems: [],
        suggestedArticles: [],
        EVENT: {
          UPDATE: 'update',
        },
      };
    },
    computed: {
      className () {
        return classNames('HomePageSectionArticle', {
          'HomePageSectionArticle--main': this.main,
          'HomePageSectionArticle--edit-mode': this.editMode,
        });
      },
      imageUrl () {
        return getCroppedImageUrl(this.article.image.url, ASPECT_RATIO.w16h9);
      },
      formatPublicationDate () {
        return moment(this.article.publication_date).format('MMM DD YYYY');
      }
    },
    methods: {
      startEdit () {
        this.editMode = true;
      },

      finishEdit () {
        this.editMode = false;
      },

      onAutoCompleteChange({ name, value }) {
        if (name) {
          this[name] = value;
          this.fetchSuggestedArticles(value);
        }
      },

      onAutoCompleteSelect({ name, selectedIndex }) {
        if (name) {
          this.newArticleTitle = this.newArticleItems[selectedIndex].text;
          this.$emit(
            this.EVENT.UPDATE,
            {
              index: this.index,
              article: this.suggestedArticles[selectedIndex],
            }
          );
          this.finishEdit();
        }
      },

      fetchSuggestedArticles (titleInput) {
        return axios
          .get(`${env.API_HOST}/api/v1/category/${this.category.slug}/articles?title=${titleInput}&limit=5`)
          .then(response => {
            if (response.status === 200) {
              this.processSuggestedArticles(response.data);
            } else {
              console.error('Could not get suggested articles', response);
            }
          })
          .catch(error => {
            console.error(error);
          });
      },

      processSuggestedArticles (suggestedArticles) {
        if (suggestedArticles) {
          this.suggestedArticles = suggestedArticles;
          this.newArticleItems = suggestedArticles.map(article => ({
            text: article.title,
            value: article.slug,
          }));
        }
      },
    }
  };
</script>

<style lang="scss">
  @import '../styles/colors';
  @import '../styles/typography';

  $componentName: 'HomePageSectionArticle';

  .#{$componentName} {
    width: 100%;
    height: 160px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    margin-top: 30px;

    &__image-wrapper {
      width: auto;
      height: 100%;
      flex-shrink: 0;
      background: $color-light-grey;
      overflow: hidden;
    }

    &__image {
      width: 284px;

      .#{$componentName}--edit-mode & {
        visibility: hidden;
      }
    }

    &__info {
      height: 100%;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      margin-left: 20px;
      position: relative;
    }

    &__title {
      font-family: $font-dincyr-bold;
      font-size: 20px;
      line-height: 28px;
      color: $color-black-darker;
      transform: translateY(-7px);
      cursor: pointer;
    }

    &__slug {
      font-family: $font-dincyr-regular;
      font-size: 16px;
      line-height: 20px;
      color: $color-black-darker;
      cursor: pointer;
    }

    &__metadata {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 1em;
      position: absolute;
      bottom: 0;
      left: 0;
      font-family: $font-dincyr-bold;
      font-size: 1.4em;
      line-height: 1em;
      color: $color-grey;
    }

    &__publication-date {
      margin-right: 20px;
    }

    &__views-count {
      display: flex;
      flex-direction: row;
      align-items: center;

      &-icon {
        width: 20px;
        height: 20px;
      }

      &-value {
        margin-left: 0.5em;
      }
    }

    &__comments-count {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-left: 2em;

      &-icon {
        width: 20px;
        height: 20px;
        margin-top: 2px;
      }

      &-value {
        margin-left: 0.5em;
      }
    }

    &__auto-complete {
      margin-left: 20px;
    }
  }
</style>
