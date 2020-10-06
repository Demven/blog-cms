<template>
  <div :class="className">
    <div class="QuoteContent__wrapper">
      <p
        class="QuoteContent__content-text"
        @click="onEdit"
        v-if="!editMode"
      >
        {{text || content.text}}
      </p>
      <p
        class="QuoteContent__content-credit"
        @click="onEdit"
        v-if="!editMode && (credit || content.credit)"
      >
        {{credit || content.credit}}
      </p>

      <div
        class="QuoteContent__text-field"
        v-if="editMode"
      >
        <TextArea
          :name="'text'"
          :label="'Quote'"
          :rows="3"
          :placeholder="'Text'"
          :initial-value="text || content.text"
          required
          @change="onFieldChange"
        ></TextArea>
      </div>

      <div
        class="QuoteContent__credit-field"
        v-if="editMode"
      >
        <TextField
          :name="'credit'"
          :label="'Credit'"
          :placeholder="'Elon Mask'"
          :value="credit || content.credit"
          required
          @change="onFieldChange"
        ></TextField>
      </div>
    </div>

    <div class="QuoteContent__actions">
      <button
        class="QuoteContent__action QuoteContent__delete"
        @click="onDelete"
      >
        <Icon :name="ICON_CLOSE"></Icon>
      </button>

      <button
        class="QuoteContent__action QuoteContent__done"
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
  import TextField from '../TextField';
  import Icon from '../Icon/Icon';
  import { ICON } from '../Icon/icons';
  import { formatMarkdown } from '../../services/markdown-service';

  // class QuoteModel {
  //   type: string;
  //   text: string;
  //   credit: string;
  // }
  
  export default {
    name: 'QuoteContent',
    components: { TextField, Icon, TextArea },
    props: {
      index: String,
      content: Object,
    },
    data () {
      return {
        editMode: false,
        text: '',
        credit: '',
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
        return classNames('QuoteContent', {
          'QuoteContent--edit-mode': this.editMode,
        });
      },
      htmlContent () {
        return formatMarkdown(this.currentValue || this.content.text);
      },
    },
    created () {
      if (!this.content.text && !this.text) {
        this.editMode = true;
      }
    },
    methods: {
      onFieldChange ({ name, value }) {
        if (name && value) {
          this[name] = value;
        }
      },
      
      onEdit () {
        this.editMode = true;
      },

      onSave () {
        this.editMode = false;

        if (this.text && this.text.length > 0) {
          this.$emit(this.EVENT.UPDATE, {
            index: this.index,
            content: {
              ...this.content,
              text: this.text,
              credit: this.credit,
            },
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

  $componentName: 'QuoteContent';

  .#{$componentName} {
    display: flex;
    flex-direction: row;

    &__wrapper {
      width: 660px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .#{$componentName}--edit-mode & {
        align-items: normal;
      }
    }

    &__content-text {
      width: 565px;
      position: relative;
      font-family: $font-dincyr-bold;
      font-size: 28px;
      line-height: 38px;
      font-style: italic;
      color: $color-black-darker;
      cursor: pointer;

      &:before {
        content: '        ';
        white-space: pre-wrap;
      }

      &:after {
        content: '';
        display: block;
        width: 81px;
        height: 62px;
        background-image: url('/images/quote.jpg');
        background-size: 81px 62px;
        position: absolute;
        left: -37px;
        top: -23px;
        transform: skewX(-13deg);
      }
    }

    &__content-credit {
      margin: 24px 0 24px 0;
      font-family: $font-dincyr-regular;
      font-size: 16px;
      line-height: 16px;
      color: $color-black-darker;
      cursor: pointer;

      &:before {
        content: '– ';
        font-size: 16px;
        line-height: 16px;
        color: $color-black-darker;
      }
    }

    &__text-field {
      margin-top: 20px;
    }

    &__credit-field {
      margin-top: 20px;
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
      -appearance: none;
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
