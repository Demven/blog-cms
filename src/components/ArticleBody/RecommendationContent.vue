<template>
  <div :class="className">
    <div class="RecommendationContent__wrapper">
      <div
        class="RecommendationContent__content"
        v-if="!editMode"
      >
        <div
          class="RecommendationContent__preview"
          @click="onEdit"
        >
          <Label
            class="RecommendationContent__label"
            :green="content.category.color === 'green'"
            :red="content.category.color === 'red'"
            :blue="content.category.color === 'blue'"
            small
          >{{content.category.title}}</Label>

          <h3 class="RecommendationContent__read-these-too">Read These Too</h3>

          <ul class="RecommendationContent__articles">
            <li
              class="RecommendationContent__article"
              v-for="article in articles"
              :key="article._id"
            >
              <img
                class="RecommendationContent__article-image"
                :src="getImagePreviewUrl(article.image.url)"
              />

              <h4 class="RecommendationContent__article-title">
                <a
                  class="RecommendationContent__article-link"
                  target="_blank"
                  :href="`/article/${article.slug}`"
                >
                  {{article.title}}
                </a>
              </h4>

              <div class="RecommendationContent__article-views">
                {{article.views.count}}
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="RecommendationContent__form"
        v-if="editMode"
      >
        <div class="RecommendationContent__select">
          <SelectField
            :name="'recommendation-type'"
            :label="'Recommendation Type'"
            :selectedIndex="selectedRecommendationTypeIndex"
            :values="RECOMMENDATION_TYPES"
            @select="onRecommendationTypeChange"
          ></SelectField>
        </div>
      </div>
    </div>

    <div class="RecommendationContent__actions">
      <button
        class="RecommendationContent__action RecommendationContent__delete"
        @click="onDelete"
      >
        <Icon :name="ICON_CLOSE"></Icon>
      </button>

      <button
        class="RecommendationContent__action RecommendationContent__done"
        @click="onSave"
        v-if="editMode"
      >
        <Icon :name="ICON_DONE"></Icon>
      </button>
    </div>
  </div>
</template>

<script>
  import classNames from 'classnames';
  import SelectField from '../SelectField';
  import Icon from '../Icon/Icon';
  import { ICON } from '../Icon/icons';
  import Label from '../Label.vue';
  import { gqlQuery } from '../../services/gql-service';
  import { ASPECT_RATIO, getCroppedImageUrl } from '../../services/images-service';

  // class RecommendationModel {
  //   type: string;
  //   recommendationType: string;
  //   category: string;
  // }

  export default {
    name: 'RecommendationContent',
    components: { SelectField, Icon, Label },
    props: {
      index: String,
      content: Object,
    },
    data () {
      return {
        editMode: false,
        selectedRecommendationTypeIndex: 0,
        EVENT: {
          UPDATE: 'update',
          REMOVE: 'remove',
        },
        ICON_DONE: ICON.DONE,
        ICON_CLOSE: ICON.CLOSE,
        RECOMMENDATION_TYPES: [
          {
            text: 'Most Popular In Category',
            value: 'most-popular-in-category',
          },
        ],
        articles: [],
      };
    },
    computed: {
      className () {
        return classNames('RecommendationContent', {
          'RecommendationContent--edit-mode': this.editMode,
        });
      },
    },
    created () {
      if (!this.content.recommendationType) {
        this.editMode = true;
      } else {
        this.selectedRecommendationTypeIndex = this.RECOMMENDATION_TYPES.findIndex(type => type.value === this.content.recommendationType);
        this.fetchRecommendations();
      }
    },
    methods: {
      onRecommendationTypeChange (selectedIndex) {
        this.selectedRecommendationTypeIndex = selectedIndex;

        this.$emit(this.EVENT.UPDATE, {
          index: this.index,
          content: {
            ...this.content,
            recommendationType: this.RECOMMENDATION_TYPES[selectedIndex].value,
          },
        });
      },

      onEdit (event) {
        const isArticleClick = !!event.path.find(node => node.className === 'RecommendationContent__article-link');

        if (!isArticleClick) {
          this.editMode = true;
        }
      },

      onSave () {
        this.editMode = false;

        if (this.selectedRecommendationTypeIndex >= 0) {
          this.$emit(this.EVENT.UPDATE, {
            index: this.index,
            content: {
              ...this.content,
              recommendationType: this.content.recommendationType || this.RECOMMENDATION_TYPES[this.selectedRecommendationTypeIndex].value,
              // category: object added in ArticlePage in onAddContent()
            },
          });

          this.fetchRecommendations();
        } else if (!this.content.code) {
          this.onDelete();
        }
      },

      onDelete () {
        this.$emit(this.EVENT.REMOVE, { index: this.index });
      },

      fetchRecommendations () {
        return gqlQuery(`
          mostPopularInCategory (
            categorySlug: "${this.content.category.slug}",
            excludeSlug: null,
            limit:3
          ) {
            _id
            slug
            title
            image {
              url
            }
            views {
              count
            }
          }
        `)
          .then(data => {
            if (data?.mostPopularInCategory) {
              this.articles = data.mostPopularInCategory;
            } else {
              console.error('Could not fetch recommendations', data);
            }
          })
          .catch(error => {
            console.error(error);
          });
      },

      getImagePreviewUrl (url) {
        return getCroppedImageUrl(url, ASPECT_RATIO.w3h2, 320);
      },
    },
  };
</script>

<style lang="scss">
  @import '../../styles/colors';
  @import '../../styles/typography';
  @import '../../styles/media';

  $componentName: 'RecommendationContent';

  .#{$componentName} {
    display: flex;
    flex-direction: row;
    margin: 10px 0;

    &__wrapper {
      width: 660px;
    }

    &__content {
      position: relative;
    }

    &__preview {
      padding: 15px;
      margin: 0;
      background: $color-white;
      box-shadow: 3px 3px 6px 3px rgb(0 0 0 / 8%);
      border-radius: 4px;
      cursor: pointer;
    }

    &__label {
      font-size: 14px;
    }

    &__read-these-too {
      margin: 0;
      padding: 0;
      font-family: $font-dincyr-bold;
      font-size: 18px;
      line-height: 1;
      text-align: center;
    }

    &__articles {
      margin: 20px 0 0 0;
      list-style: none;
      display: flex;
      padding: 0;
      justify-content: space-between;
      flex-wrap: nowrap;
    }

    &__article {
      width: calc(100%/3 - 10px);
      position: relative;
    }

    &__article-image {
      width: 100%;
    }

    &__article-title {
      width: 100%;
      padding: 32px 12px 12px;
      position: absolute;
      left: 0;
      bottom: 0;
      font-family: $font-dincyr-bold;
      font-size: 14px;
      line-height: 1.4;
      box-sizing: border-box;
      background: linear-gradient(to top, $color-black, transparent);
    }

    &__article-link {
      color: $color-white;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    &__article-views {
      padding: 4px 6px;
      position: absolute;
      right: 4px;
      top: 4px;
      color: $color-light-grey;
      font-family: $font-dincyr-regular;
      font-size: 13px;
      line-height: 1;
      background: black;
      background: rgba($color-black, 0.5);
      border-radius: 3px;
    }

    &__actions {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      flex-grow: 1;
    }

    &__action {
      -webkit-appearance: none;
      appearance: none;
      width: 28px;
      height: 28px;
      padding: 0;
      margin: 0;
      outline: none;
      background: none;
      border: none;
      cursor: pointer;
      position: relative;

      & .Icon {
        width: 32px;
        height: 32px;
        color: $color-black-medium;
      }
    }

    &__done {
      &:hover {
        & .Icon {
          color: $color-green;
        }
      }
    }

    &__delete {
      &:hover {
        & .Icon {
          color: $color-red;
        }
      }
    }
  }
</style>
