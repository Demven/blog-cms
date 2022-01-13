<template>
  <div :class="className">
    <div class="MathContent__wrapper">
      <p
        class="MathContent__content"
        id="generatedId"
        @click="onEdit"
        v-if="!editMode"
      >`{{currentValue || content.equation}}`</p>

      <TextArea
        :name="'equation'"
        :rows="3"
        :placeholder="'ASCII Equation'"
        :initial-value="currentValue || content.equation"
        required
        @change="onFieldChange"
        v-if="editMode"
      ></TextArea>
    </div>

    <div class="MathContent__actions">
      <button
        class="MathContent__action MathContent__delete"
        @click="onDelete"
      >
        <Icon :name="ICON_CLOSE"></Icon>
      </button>

      <button
        class="MathContent__action MathContent__done"
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
  import mathService from '../../services/math-service';

  // class MathModel {
  //   type: string;
  //   equation: string;
  // }

  export default {
    name: 'MathContent',
    components: { Icon, TextArea },
    props: {
      index: String,
      content: Object,
    },
    data () {
      return {
        editMode: false,
        currentValue: '',
        generatedId: `math-${Math.floor(Math.random() * 10000)}`,
        EVENT: {
          UPDATE: 'update',
          REMOVE: 'remove',
        },
        ICON_DONE: ICON.DONE,
        ICON_CLOSE: ICON.CLOSE,
      };
    },
    computed: {
      className () {
        return classNames('MathContent', {
          'MathContent--edit-mode': this.editMode,
        });
      },
    },
    created () {
      if (!this.content.equation && !this.currentValue) {
        this.editMode = true;
      } else {
        this.renderEquation();
      }
    },
    methods: {
      renderEquation() {
        mathService.renderEquation(`#${this.generatedId}`);
      },

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
            content: {
              ...this.content,
              equation: this.currentValue,
            },
          });
        } else if (!this.content.equation) {
          this.onDelete();
        }

        window.setTimeout(this.renderEquation, 100);
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

  $componentName: 'MathContent';

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
      color: $color-black-darker;
      text-align: center;
      cursor: pointer;

      & strong {
        font-family: $font-dincyr-bold;
      }

      & a {
        color: $color-aquamarine;
      }
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
