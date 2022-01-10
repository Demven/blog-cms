<template>
  <div :class="className">
    <div
      class="InsertContent__content-types"
      v-if="contentTypesVisible"
    >
      <SelectField
        class="InsertContent__content-type"
        :name="'content-type'"
        :label="'Select Content Type'"
        :selectedIndex="selectedContentTypeIndex"
        :values="contentTypes"
        @select="onSelectContentType"
      ></SelectField>
    </div>

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
  import SelectField from '../components/SelectField';
  import Icon from './Icon/Icon';
  import { ICON } from './Icon/icons';
  import { CONTENT_TYPE } from './ArticleBody/content-types';
  import { uuid } from '../services/uuid-service';

  export default {
    name: 'InsertContent',
    components: { Icon, SelectField },
    props: {
      index: Number,
      small: Boolean,
    },
    data () {
      return {
        contentTypesVisible: false,
        selectedContentTypeIndex: 0,
        contentTypes: [
          { text: 'Text', value: CONTENT_TYPE.TEXT },
          { text: 'Image', value: CONTENT_TYPE.INLINE_IMAGE },
          { text: 'Heading', value: CONTENT_TYPE.HEADING },
          { text: 'Epigraph', value: CONTENT_TYPE.EPIGRAPH },
          { text: 'List', value: CONTENT_TYPE.LIST },
          { text: 'Math', value: CONTENT_TYPE.MATH },
          { text: 'Code', value: CONTENT_TYPE.CODE },
          { text: 'Embed', value: CONTENT_TYPE.EMBED },
          { text: 'Video', value: CONTENT_TYPE.VIDEO },
          { text: 'Quote', value: CONTENT_TYPE.QUOTE },
          { text: 'Recommendation', value: CONTENT_TYPE.RECOMMENDATION },
        ],
        EVENT: {
          ADD_CONTENT: 'add-content',
        },
        CONTENT_TYPE,
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

      onSelectContentType (contentTypeIndex) {
        const selectedContentType = this.contentTypes[contentTypeIndex];

        if (selectedContentType) {
          this.contentTypesVisible = false;

          const bodyNode = {
            id: uuid(),
            type: selectedContentType.value,
          };
          this.$emit(this.EVENT.ADD_CONTENT, { index: this.index, bodyNode });
        }
      },
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
    opacity: 0;
    transition: opacity 0.4s;

    &:hover {
      opacity: 1;
    }
    
    &--small {
      height: 40px;
      margin-top: 0;
    }
    &--content-types-visible {
      height: 84px;
      opacity: 1;
    }

    &__content-types {
      width: 0;
      list-style: none;
      padding: 0;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      font-family: $font-dincyr-bold;
      font-size: 16px;
      color: $color-black-medium;
      transition: width 0.3s;

      .#{$componentName}--content-types-visible & {
        width: 386px;
      }
      
      .#{$componentName}--small & {
        margin: 0;
      }
    }

    &__content-type {
      margin: 0 auto;
      cursor: pointer;
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
        margin-top: 10px;
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
