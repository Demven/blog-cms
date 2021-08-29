<template>
  <div class="HomePageSection">
    <Label
      :green="section.category.color === 'green'"
      :red="section.category.color === 'red'"
      :blue="section.category.color === 'blue'"
      small
    >{{section.category.title}}</Label>

    <HomePageSectionArticle
      v-for="(article, index) in section.articles"
      :key="article._id"
      :index="index"
      :article="article"
      :category="section.category"
      :main="index === 0"
      @update="onSectionArticleUpdate"
    ></HomePageSectionArticle>
  </div>
</template>

<script>
  import Label from './Label.vue';
  import HomePageSectionArticle from './HomePageSectionArticle.vue';

  export default {
    name: 'HomePageSection',
    props: {
      index: Number,
      section: Object,
    },
    components: {
      Label,
      HomePageSectionArticle,
    },
    data () {
      return {
        EVENT: {
          UPDATE: 'update',
        },
      };
    },
    methods: {
      onSectionArticleUpdate ({ index, article }) {
        if (article) {
          const updatedArticles = [...this.section.articles];
          updatedArticles[index] = article;

          const updatedHomepageSection = {
            ...this.section,
            articles: updatedArticles,
          };

          this.$emit(
            this.EVENT.UPDATE,
            {
              index: this.index,
              section: updatedHomepageSection,
            }
          );
        }
      }
    }
  };
</script>

<style lang="scss">
  @import '../styles/colors';

  .HomePageSection {
    width: 860px;
    height: auto;
    margin-top: 30px;
    padding: 25px;
    position: relative;
    display: flex;
    flex-direction: column;
    background: $color-white;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.05);
    box-sizing: border-box;
  }
</style>
