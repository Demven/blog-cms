<template>
  <div :class="className">
    <ul class="InsertContent__content-types">
      <li
         class="InsertContent__content-type"
         @click="onAddContent(CONTENT_TYPE.TEXT)"
      >
        Text
      </li>

      <li
         class="InsertContent__content-type"
         @click="onAddContent(CONTENT_TYPE.INLINE_IMAGE)"
      >
        Image
      </li>

      <li
         class="InsertContent__content-type"
         @click="onAddContent(CONTENT_TYPE.HEADING)"
      >
        Heading
      </li>

      <li
         class="InsertContent__content-type"
         @click="onAddContent(CONTENT_TYPE.EPIGRAPH)"
      >
        Epigraph
      </li>

      <li
         class="InsertContent__content-type"
         @click="onAddContent(CONTENT_TYPE.LIST, { listType: LIST_TYPE.BULLET })"
      >
        List
      </li>

      <li
         class="InsertContent__content-type"
         @click="onAddContent(CONTENT_TYPE.MATH)"
      >
        Math
      </li>

      <li
         class="InsertContent__content-type"
         @click="onAddContent(CONTENT_TYPE.CODE)"
      >
        Code
      </li>

      <li
         class="InsertContent__content-type"
         @click="onAddContent(CONTENT_TYPE.EMBED)"
      >
        Embed
      </li>

      <li
         class="InsertContent__content-type"
         @click="onAddContent(CONTENT_TYPE.VIDEO)"
      >
        Video
      </li>

      <li
         class="InsertContent__content-type"
         @click="onAddContent(CONTENT_TYPE.QUOTE)">
        Quote
      </li>
    </ul>

    <button
       class="InsertContent__add-button"
       @click="contentTypesVisible ? hideContentTypes() : showContentTypes()"
    >
      <Icon :name="ICON_ADD"></Icon>
    </button>
  </div>
</template>

<script>
  import classNames from 'classnames';
  import Icon from './Icon/Icon';
  import { ICON } from './Icon/icons';
  import { CONTENT_TYPE } from './ArticleBody/content-types';
  import { LIST_TYPE } from './ArticleBody/list-types';

  export default {
    name: 'InsertContent',
    components: { Icon },
    props: {
      index: Number,
      small: Boolean,
    },
    data () {
      return {
        contentTypesVisible: false,
        EVENT: {
          ADD_CONTENT: 'add-content',
        },
        CONTENT_TYPE,
        LIST_TYPE,
        ICON_ADD: ICON.ADD,
      };
    },
    computed: {
      className () {
        return classNames('InsertContent', {
          'InsertContent--content-types-visible': this.contentTypesVisible,
          'InsertContent--small': this.small,
        });
      },
    },
    methods: {
      showContentTypes () {
        this.contentTypesVisible = true;
      },

      hideContentTypes () {
        this.contentTypesVisible = false;
      },

      onAddContent (contentType, additionalData = {}) {
        this.contentTypesVisible = false;

        const bodyNode = { type: contentType, ...additionalData };
        this.$emit(this.EVENT.ADD_CONTENT, { index: this.index, bodyNode });
      }
    },
  };
</script>

<style lang="scss">
  @import '../styles/colors';
  @import '../styles/media';
  @import '../styles/typography';

  $componentName: 'InsertContent';

  .#{$componentName} {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
    margin-top: 60px;
    margin-right: 80px;
    
    &--small {
      height: 40px;
      margin-top: 0;
    }

    &__content-types {
      width: 0;
      list-style: none;
      padding: 0;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      overflow: hidden;
      font-family: $font-dincyr-bold;
      font-size: 16px;
      color: $color-black-medium;
      transition: width 0.3s;

      .#{$componentName}--content-types-visible & {
        width: 569px;
      }
      
      .#{$componentName}--small & {
        margin: 0;
      }
    }

    &__content-type {
      margin-right: 15px;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }

    &__add-button {
      -webkit-appearance: none;
      appearance: none;
      width: 60px;
      height: 60px;
      padding: 0;
      margin: 0;
      outline: none;
      background: none;
      border: none;
      cursor: pointer;
      position: relative;
      transition: transform 0.3s, color 0.3s;
      transform: scale(1);

      &:hover {
        transform: scale(1.1);

        .#{$componentName}--content-types-visible & {
          transform: scale(1.1) rotate(45deg);
        }
      }

      .#{$componentName}--small & {
        width: 40px;
        height: 40px;
      }

      .#{$componentName}--content-types-visible & {
        transform: rotate(45deg);
      }

      & .Icon {
        width: 60px;
        height: 60px;
        color: $color-aquamarine;

        .#{$componentName}--content-types-visible & {
          color: $color-red;
        }
        
        .#{$componentName}--small & {
          width: 40px;
          height: 40px;
        }
      }
    }
  }
</style>
