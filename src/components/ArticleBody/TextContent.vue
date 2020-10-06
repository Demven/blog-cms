<template>
  <div :class="className">
    <div class="TextContent__wrapper">
      <p
        class="TextContent__content"
        v-if="!editMode"
        v-html="htmlContent"
        @click="onEdit"
      ></p>

      <TextArea
        :name="index"
        :rows="3"
        :placeholder="'Text'"
        :initial-value="content.text || ''"
        required
        @change="onFieldChange"
        v-if="editMode"
      ></TextArea>
    </div>

    <div class="TextContent__actions">
      <button
        class="TextContent__action TextContent__delete"
        @click="onDelete"
      >
        <Icon :name="ICON_CLOSE"></Icon>
      </button>

      <button
        class="TextContent__action TextContent__done"
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
  import TextArea from '../TextArea';
  import Icon from '../Icon/Icon';
  import { ICON } from '../Icon/icons';
  import { formatMarkdown } from '../../services/markdown-service';

  // class TextModel {
  //   type: string;
  //   text: string;
  // }

  export default {
    name: 'TextContent',
    components: { Icon, TextArea },
    props: {
      index: String,
      content: Object,
    },
    data () {
      return {
        editMode: false,
        currentValue: '',
        EVENT: {
          UPDATE: 'update',
          REMOVE: 'remove',
        },
        ICON_CLOSE: ICON.CLOSE,
        ICON_DONE: ICON.DONE,
      };
    },
    computed: {
      className () {
        return classNames('TextContent', {
          'TextContent--edit-mode': this.editMode,
        });
      },
      htmlContent () {
        return formatMarkdown(this.currentValue || this.content.text);
      },
    },
    created () {
      if (!this.content.text && !this.currentValue) {
        this.editMode = true;
      }
    },
    methods: {
      onFieldChange ({ name, value }) {
        if (name && value) {
          this.currentValue = value;
        }
      },

      onEdit () {
        this.editMode = true;
      },

      onSave () {
        this.editMode = false;

        if (this.currentValue && this.currentValue.length > 0) {
          this.$emit(this.EVENT.UPDATE, {
            index: this.index,
            content: { ...this.content, text: this.currentValue },
          });
        } else if (!this.content.text) {
          this.onDelete();
        }
      },

      onDelete () {
        this.$emit(this.EVENT.REMOVE, { index: this.index });
      },
    },
  };
</script>

<style lang="scss">
  @import '../../styles/colors';
  @import '../../styles/typography';
  @import '../../styles/markdown';

  $componentName: 'TextContent';

  .#{$componentName} {
    display: flex;
    flex-direction: row;

    &__wrapper {
      width: 660px;
    }

    &__content {
      padding: 8px 10px 8px 0;
      font-family: $font-dincyr-regular;
      font-size: 16px;
      line-height: 19px;
      color: $color-black-darker;
      cursor: pointer;

      @include markdown-bold;
      @include markdown-link;
      @include markdown-code;
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
