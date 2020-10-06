<template>
  <div :class="className">
    <div class="EpigraphContent__wrapper">
      <p
        class="EpigraphContent__content-text" 
        @click="onEdit"
        v-if="!editMode"
      >{{text || content.text}}</p>
      <p
        class="EpigraphContent__content-credit"
        @click="onEdit"
        v-if="!editMode"
      >{{credit || content.credit}}</p>

      <div
        class="EpigraphContent__text-field"
        v-if="editMode"
      >
        <TextArea
          :name="'text'"
          :label="'Epigraph'"
          :rows="3"
          :placeholder="'Text'"
          :initial-value="text || content.text"
          required
          @change="onFieldChange"
        ></TextArea>
      </div>
      <div
        class="EpigraphContent__credit-field"
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

    <div class="EpigraphContent__actions">
      <button
        class="EpigraphContent__action EpigraphContent__delete"
        @click="onDelete"
      >
        <Icon :name="ICON_CLOSE"></Icon>
      </button>

      <button
        class="EpigraphContent__action EpigraphContent__done"
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
  import TextArea from "@/components/TextArea";

  // class EpigraphModel {
  //   type: string;
  //   text: string;
  //   credit: string;
  // }

  export default {
    name: 'EpigraphContent',
    components: { TextArea, TextField, Icon },
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
        return classNames('EpigraphContent', {
          'EpigraphContent--edit-mode': this.editMode,
        });
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
          const content = {
            ...this.content,
            text: this.text,
            credit: this.credit,
          };
          this.$emit(this.EVENT.UPDATE, { index: this.index, content });
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

  $componentName: 'EpigraphContent';

  .#{$componentName} {
    display: flex;
    flex-direction: row;

    &__wrapper {
      width: 660px;
    }

    &__content-text {
      max-width: 70%;
      margin-left: auto;
      padding: 8px 10px 8px 0;
      font-family: $font-dincyr-regular;
      font-size: 16px;
      font-style: italic;
      color: $color-black-darker;
      cursor: pointer;
    }

    &__content-credit {
      padding: 8px;
      font-family: $font-dincyr-regular;
      font-size: 16px;
      color: $color-black-darker;
      cursor: pointer;
      text-align: right;
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
