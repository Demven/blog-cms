<template>
  <div :class="className">
    <div class="EmbedContent__wrapper">
      <div
        class="EmbedContent__preview"
        @click="onEdit"
        v-if="!editMode"
      >
        <Embedded :embed="currentEmbedValue || content.embed"></Embedded>

        <p
          class="EmbedContent__content"
          v-if="content.embed"
        >
          {{content.embed.substring(0, 65)}}...
        </p>
        <p
          class="EmbedContent__caption"
          v-if="content.caption"
        >
          {{content.caption}}
        </p>
        <p
          class="EmbedContent__credits"
          v-if="content.credits"
        >
          {{content.credits}}
        </p>
      </div>

      <div
        class="EmbedContent__form"
        v-if="editMode"
      >
        <TextArea
          :name="'embed'"
          :rows="5"
          :placeholder="'Paste HTML code here (scripts are supported)'"
          :initial-value="currentEmbedValue || content.embed"
          required
          @change="onEmbedChange"
        ></TextArea>

        <div class="EmbedContent__caption-field">
          <TextArea
            :name="'caption'"
            :label="'Caption'"
            :rows="3"
            :placeholder="'Caption'"
            :initial-value="caption || content.caption"
            @change="onFieldChange"
          ></TextArea>
        </div>

        <div class="EmbedContent__credits-field">
          <TextField
            :name="'credits'"
            :label="'Credits'"
            :placeholder="'Instagram'"
            :value="credits || content.credits"
            @change="onFieldChange"
          ></TextField>
        </div>
      </div>
    </div>

    <div class="EmbedContent__actions">
      <button
        class="EmbedContent__action EmbedContent__delete"
        @click="onDelete"
      >
        <Icon :name="ICON_CLOSE"></Icon>
      </button>

      <button
        class="EmbedContent__action EmbedContent__done"
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
  import Embedded from '../Embedded';
  import TextArea from '../TextArea';

  // class EmbedModel {
  //   type: string;
  //   embed: string;
  //   caption: string;
  //   credits: string;
  // }

  export default {
    name: 'EmbedContent',
    components: { TextArea, Embedded, TextField, Icon },
    props: {
      index: String,
      content: Object,
    },
    data () {
      return {
        editMode: false,
        currentEmbedValue: '',
        caption: '',
        credits: '',
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
        return classNames('EmbedContent', {
          'EmbedContent--edit-mode': this.editMode,
        });
      },
    },
    created () {
      if (!this.content.embed && !this.currentEmbedValue) {
        this.editMode = true;
      } else {
        this.currentEmbedValue = this.content.embed || '';
      }
    },
    methods: {
      onEmbedChange({ name, value }) {
        if (name && value) {
          this.currentEmbedValue = value;
        }
      },

      onFieldChange({ name, value }) {
        if (name) {
          this[name] = value;

          if (value === '') {
            this.content[name] = value;
          }
        }
      },

      onEdit () {
        this.editMode = true;
      },

      onSave () {
        this.editMode = false;

        if (this.currentEmbedValue && this.currentEmbedValue.length > 0) {
          this.$emit(this.EVENT.UPDATE, {
            index: this.index,
            content: {
              ...this.content,
              embed: this.currentEmbedValue,
              caption: this.caption,
              credits: this.credits,
            },
          });
        } else if (!this.content.embed) {
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

  $componentName: 'EmbedContent';

  .#{$componentName} {
    display: flex;
    flex-direction: row;
    margin: 10px 0;

    &__wrapper {
      width: 660px;
    }

    &__preview {
      cursor: pointer;
      position: relative;
      font-family: $font-dincyr-regular;
      font-size: 16px;
      color: $color-black-darker;
    }

    &__content {
      &:before {
        content: 'Content: ';
        font-size: 14px;
        font-family: $font-dincyr-bold;
        color: $color-aquamarine;
      }
    }

    &__caption-field {
      margin-top: 20px;
    }

    &__caption {
      padding: 8px 10px 8px 0;
      cursor: pointer;
    }

    &__caption {
      &:before {
        content: 'Caption: ';
        font-size: 14px;
        font-family: $font-dincyr-bold;
        color: $color-aquamarine;
      }
    }

    &__credits-field {
      margin-top: 20px;
    }

    &__credits {
      &:before {
        content: 'Credits: ';
        font-size: 14px;
        font-family: $font-dincyr-bold;
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
