<template>
  <div class="ArticleBodyNode">
    <div class="ArticleBodyNode__before-node-container">
      <InsertContent
        :index="index"
        small
        @add-content="onAddContent"
      ></InsertContent>
    </div>

    <component
      :is="componentName"
      :index="String(index)"
      :content="content"
      @update="onUpdateContent"
      @remove="onRemoveContent"
    />
  </div>
</template>

<script>
  import HomePageSectionArticle from '../HomePageSectionArticle.vue';
  import InsertContent from '../../components/InsertContent';
  import TextContent from './TextContent';
  import InlineImageContent from './InlineImageContent';
  import HeadingContent from './HeadingContent';
  import EpigraphContent from './EpigraphContent';
  import ListContent from './ListContent';
  import MathContent from './MathContent';
  import CodeContent from './CodeContent';
  import EmbedContent from './EmbedContent';
  import VideoContent from './VideoContent';
  import QuoteContent from './QuoteContent';
  import { CONTENT_TYPE } from './content-types';

  export default {
    name: 'ArticleBodyNode',
    props: {
      index: Number,
      content: Object,
    },
    components: {
      HomePageSectionArticle,
      InsertContent,
      TextContent,
      InlineImageContent,
      HeadingContent,
      EpigraphContent,
      ListContent,
      MathContent,
      CodeContent,
      EmbedContent,
      VideoContent,
      QuoteContent,
    },
    data () {
      return {
        componentName: this.getComponentNameByNodeType(this.content.type),
        EVENT: {
          UPDATE: 'update',
          REMOVE: 'remove',
          ADD_CONTENT: 'add-content',
        },
      };
    },
    methods: {
      getComponentNameByNodeType (nodeType) {
        switch (nodeType) {
          case CONTENT_TYPE.TEXT:
            return 'TextContent';
          case CONTENT_TYPE.INLINE_IMAGE:
            return 'InlineImageContent';
          case CONTENT_TYPE.HEADING:
            return 'HeadingContent';
          case CONTENT_TYPE.EPIGRAPH:
            return 'EpigraphContent';
          case CONTENT_TYPE.LIST:
            return 'ListContent';
          case CONTENT_TYPE.MATH:
            return 'MathContent';
          case CONTENT_TYPE.CODE:
            return 'CodeContent';
          case CONTENT_TYPE.EMBED:
            return 'EmbedContent';
          case CONTENT_TYPE.VIDEO:
            return 'VideoContent';
          case CONTENT_TYPE.QUOTE:
            return 'QuoteContent';
          default:
            return '';
        }
      },

      onAddContent (event) {
        this.$emit(this.EVENT.ADD_CONTENT, event);
      },

      onUpdateContent (event) {
        this.$emit(this.EVENT.UPDATE, event);
      },

      onRemoveContent (event) {
        this.$emit(this.EVENT.REMOVE, event);
      },
    }
  };
</script>

<style lang="scss">
  @import '../../styles/media';
  @import '../../styles/colors';

  .ArticleBodyNode {
    &__before-node-container {
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }
    }
  }
</style>
