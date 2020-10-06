<template>
  <div :class="className">
    <div class="HeadingContent__wrapper">
      <p
        class="HeadingContent__content"
        @click="onEdit"
        v-if="!editMode"
      >{{currentValue || content.text}}</p>

      <TextField
        :name="index"
        :placeholder="'Heading text'"
        :value="currentValue || content.text"
        required
        @change="onFieldChange"
        v-if="editMode"
      ></TextField>
    </div>

    <div class="HeadingContent__actions">
      <button
        class="HeadingContent__action HeadingContent__delete"
        @click="onDelete"
      >
        <Icon :name="ICON_CLOSE"></Icon>
      </button>

      <button
        class="HeadingContent__action HeadingContent__done"
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
  import Icon from '../Icon/Icon';
  import { ICON } from '../Icon/icons';
  import TextField from '../TextField';

  // class HeadingModel {
  //   type: string;
  //   text: string;
  // }

  export default {
    name: 'HeadingContent',
    components: { TextField, Icon },
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
        return classNames('HeadingContent', {
          'HeadingContent--edit-mode': this.editMode,
        });
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
  @import '../../styles/media';

  $componentName: 'HeadingContent';

  .#{$componentName} {
    display: flex;
    flex-direction: row;

    &__wrapper {
      width: 660px;
    }

    &__content {
      padding: 30px 10px 8px 0;
      font-family: $font-dincyr-bold;
      font-size: 22px;
      color: $color-black-darker;
      cursor: pointer;
      text-align: center;
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
