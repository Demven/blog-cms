<template>
  <div :class="className">
    <div class="InlineImageContent__wrapper">
      <img
        class="InlineImageContent__image"
        :src="imageUrl"
        v-if="url || content.url"
      />

      <div
        class="InlineImageContent__content"
        @click="onEdit"
        v-if="!editMode"
      >
        <p class="InlineImageContent__url">{{url || content.url}}</p>
        <p class="InlineImageContent__description">{{description || content.description}}</p>
        <p class="InlineImageContent__credits">{{credits || content.credits}}</p>
      </div>

      <div
        class="InlineImageContent__url-field"
        v-if="editMode"
      >
        <TextField
          :name="'url'"
          :label="'URL'"
          :placeholder="'https://images.com/robot.jpg'"
          :value="url || content.url"
          @change="onFieldChange"
          required
        ></TextField>
      </div>

      <div
        class="InlineImageContent__description-field"
        v-if="editMode"
      >
        <TextArea
          :name="'description'"
          :label="'Description'"
          :rows="3"
          :placeholder="'Description'"
          :initial-value="description || content.description"
          @change="onFieldChange"
        ></TextArea>
      </div>

      <div
        class="InlineImageContent__credits-field"
        v-if="editMode"
      >
        <TextField
          :name="'credits'"
          :label="'Credits'"
          :placeholder="'Google Photos'"
          :value="credits || content.credits"
          @change="onFieldChange"
        ></TextField>
      </div>
    </div>

    <div class="InlineImageContent__actions">
      <button
        class="InlineImageContent__action InlineImageContent__delete"
        @click="onDelete"
      >
        <Icon :name="ICON_CLOSE"></Icon>
      </button>
      <button
         class="InlineImageContent__action InlineImageContent__done"
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
  import { getCroppedImageUrl, ASPECT_RATIO } from '../../services/images-service';

  // class ImageModel {
  //   type: string;
  //   url: string;
  //   description: string;
  //   credits: string;
  // }

  export default {
    name: 'InlineImageContent',
    components: { TextField, Icon, TextArea },
    props: {
      index: String,
      content: Object,
    },
    data () {
      return {
        editMode: false,
        url: '',
        description: '',
        credits: '',
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
        return classNames('InlineImageContent', {
          'InlineImageContent--edit-mode': this.editMode,
        });
      },
      imageUrl () {
        return getCroppedImageUrl(this.url || this.content.url, ASPECT_RATIO.w16h9);
      },
    },
    created () {
      if (!this.content.url && !this.url) {
        this.editMode = true;
      }
    },
    methods: {
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

        if (this.url && this.url.length > 0) {
          const content = {
            ...this.content,
            url: this.url,
            description: this.description,
            credits: this.credits,
          };
          this.$emit(this.EVENT.UPDATE, { index: this.index, content });
        } else if (!this.content.url) {
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

  $componentName: 'InlineImageContent';

  .#{$componentName} {
    display: flex;
    flex-direction: row;

    &__wrapper {
      width: 660px;
    }

    &__content {
      font-family: $font-dincyr-regular;
      font-size: 16px;
      color: $color-black-darker;
      cursor: pointer;
    }

    &__image {
      width: 100%;
      margin-bottom: 20px;
    }

    &__url:before {
      content: 'URL: ';
      font-size: 14px;
      font-family: $font-dincyr-bold;
      color: $color-aquamarine;
    }

    &__description {
      padding: 8px 10px 8px 0;
      cursor: pointer;

      &:before {
        content: 'Description: ';
        font-size: 14px;
        font-family: $font-dincyr-bold;
        color: $color-aquamarine;
      }
    }

    &__description-field {
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

    &__credits-field {
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
