<template>
  <div :class="className">
    <div class="CodeContent__wrapper">
      <div
        class="CodeContent__content"
        v-if="!editMode"
      >
        <h4 class="CodeContent__code-type">
          {{CODE_TYPES[selectedCodeTypeIndex].text}}
        </h4>
        
        <pre
          class="CodeContent__code"
          @click="onEdit"
        >
          <code :data-language="CODE_TYPES[selectedCodeTypeIndex].value">{{currentCodeValue || content.code}}</code>
        </pre>
      </div>

      <div
        class="CodeContent__form"
        v-if="editMode"
      >
        <div class="CodeContent__select">
          <SelectField
            :name="'type'"
            :label="'Type'"
            :selectedIndex="selectedCodeTypeIndex"
            :values="CODE_TYPES"
            @select="onCodeTypeChange"
          ></SelectField>
        </div>

        <TextArea
          :name="'code'"
          :rows="5"
          :placeholder="'Code'"
          :initial-value="currentCodeValue || content.code"
          required
          @change="onCodeChange"
        ></TextArea>
      </div>
    </div>

    <div class="CodeContent__actions">
      <button
        class="CodeContent__action CodeContent__delete"
        @click="onDelete"
      >
        <Icon :name="ICON_CLOSE"></Icon>
      </button>

      <button
        class="CodeContent__action CodeContent__done"
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
  import SelectField from '../SelectField';
  import Icon from '../Icon/Icon';
  import { ICON } from '../Icon/icons';
  import codeHighlightService from '../../services/code-highlight-service';

  // class CodeModel {
  //   type: string;
  //   codeType: string;
  //   code: string;
  // }

  export default {
    name: 'CodeContent',
    components: { SelectField, Icon, TextArea },
    props: {
      index: String,
      content: Object,
    },
    data () {
      return {
        editMode: false,
        currentCodeValue: '',
        selectedCodeTypeIndex: 0,
        EVENT: {
          UPDATE: 'update',
          REMOVE: 'remove',
        },
        ICON_DONE: ICON.DONE,
        ICON_CLOSE: ICON.CLOSE,
        CODE_TYPES: [
          { text: 'JavaScript', value: 'javascript' },
          { text: 'HTML', value: 'html' },
          { text: 'CSS', value: 'css' },
          { text: 'JSON', value: 'json' },
          { text: 'Command Line', value: 'shell' },
        ],
      };
    },
    computed: {
      className () {
        return classNames('CodeContent', {
          'CodeContent--edit-mode': this.editMode,
        });
      },
    },
    created () {
      if (!this.content.code && !this.currentCodeValue) {
        this.editMode = true;
      } else {
        this.selectedCodeTypeIndex = this.CODE_TYPES.findIndex(type => type.value === this.content.codeType);
        this.renderCode();
      }
    },
    methods: {
      renderCode() {
        codeHighlightService.renderCode();
      },

      onCodeChange({ name, value }) {
        if (name && value) {
          this.currentCodeValue = value;
        }
      },

      onCodeTypeChange({ name, selectedIndex }) {
        if (name === 'type') {
          this.selectedCodeTypeIndex = selectedIndex;
          this.content.codeType = this.CODE_TYPES[selectedIndex].value;
        }
      },

      onEdit () {
        this.editMode = true;
      },

      onSave () {
        this.editMode = false;

        if (this.currentCodeValue && this.currentCodeValue.length > 0) {
          this.$emit(this.EVENT.UPDATE, {
            index: this.index,
            content: {
              ...this.content,
              codeType: this.content.codeType || this.CODE_TYPES[this.selectedCodeTypeIndex].value,
              code: this.currentCodeValue,
            },
          });
        } else if (!this.content.code) {
          this.onDelete();
        }

        window.setTimeout(this.renderCode, 100);
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
  @import '../../styles/media';

  $componentName: 'CodeContent';

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

    &__code-type {
      position: absolute;
      left: 20px;
      top: 20px;
      padding: 5px 10px;
      background: $color-dark-grey;
      border-radius: 3px;
      font-family: $font-dincyr-regular;
      font-size: 16px;
      color: $color-white;
      z-index: 10;
    }

    &__code {
      padding: 70px 20px 0;
      margin: 0;
      background: $color-white;
      border: 1px dashed $color-dark-grey;
      overflow-x: scroll;
      cursor: pointer;
    }

    &__select {
      margin-bottom: 35px;
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
