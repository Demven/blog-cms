<template>
  <div :class="className">
    <div class="VideoContent__wrapper">
      <div
        class="VideoContent__preview"
        @click="onEdit"
        v-if="!editMode"
      >
        <Embedded
          :className="'VideoContent__' + VIDEO_TYPES[selectedVideoTypeIndex].value"
          :embed="currentVideoValue || content.video"
        ></Embedded>

        <p
          class="VideoContent__content"
          v-if="content.video"
        >
          {{content.video.substring(0, 65)}}...
        </p>
        <p
          class="VideoContent__caption"
          v-if="content.caption"
        >
          {{content.caption}}
        </p>
        <p
          class="VideoContent__credits"
          v-if="content.credits"
        >
          {{content.credits}}
        </p>
      </div>

      <div
        class="VideoContent__form"
        v-if="editMode"
      >
        <div class="VideoContent__select">
          <SelectField
            :name="'type'"
            :label="'Type'"
            :selectedIndex="selectedVideoTypeIndex"
            :values="VIDEO_TYPES"
            @select="onVideoTypeChange"
          ></SelectField>
        </div>

        <TextArea
          :name="'content'"
          :rows="5"
          :placeholder="'Paste video embed code here (scripts are supported)'"
          :initial-value="currentVideoValue || content.video"
          required
          @change="onVideoChange"
        ></TextArea>

        <div class="VideoContent__caption-field">
          <TextArea
            :name="'caption'"
            :label="'Caption'"
            :rows="3"
            :placeholder="'Caption'"
            :initial-value="caption || content.caption"
            @change="onFieldChange"
          ></TextArea>
        </div>

        <div class="VideoContent__credits-field">
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

    <div class="VideoContent__actions">
      <button
        class="VideoContent__action VideoContent__delete"
        @click="onDelete"
      >
        <Icon :name="ICON_CLOSE"></Icon>
      </button>

      <button
        class="VideoContent__action VideoContent__done"
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
  import SelectField from '../SelectField';

  // class VideoModel {
  //   type: string;
  //   videoType: string;
  //   video: string;
  //   caption: string;
  //   credits: string;
  // }

  export default {
    name: 'VideoContent',
    components: { SelectField, TextArea, Embedded, TextField, Icon },
    props: {
      index: String,
      content: Object,
    },
    data () {
      return {
        editMode: false,
        currentVideoValue: '',
        selectedVideoTypeIndex: 0,
        caption: '',
        credits: '',
        VIDEO_TYPES: [
          { text: 'Youtube', value: 'youtube' },
          { text: 'Vimeo', value: 'vimeo' },
          { text: 'Facebook', value: 'facebook' },
          { text: 'Twitter', value: 'twitter' },
          { text: 'Raw', value: 'raw' },
        ],
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
        return classNames('VideoContent', {
          'VideoContent--edit-mode': this.editMode,
        });
      },
    },
    created () {
      if (!this.content.video && !this.currentVideoValue) {
        this.editMode = true;
      } else {
        this.selectedVideoTypeIndex = this.VIDEO_TYPES.findIndex(type => type.value === this.content.videoType);
        this.currentVideoValue = this.content.video || '';
      }
    },
    methods: {
      onVideoTypeChange({ name, selectedIndex }) {
        if (name === 'type') {
          this.selectedVideoTypeIndex = selectedIndex;

          this.$emit(this.EVENT.UPDATE, {
            index: this.index,
            content: {
              ...this.content,
              videoType: this.VIDEO_TYPES[selectedIndex].value,
            },
          });
        }
      },

      onVideoChange({ name, value }) {
        if (name && value) {
          this.currentVideoValue = value;
        }
      },

      onFieldChange({ name, value }) {
        if (name) {
          this[name] = value;

          if (value === '') {
            this.$emit(this.EVENT.UPDATE, {
              index: this.index,
              content: {
                ...this.content,
                [name]: value,
              },
            });
          }
        }
      },

      onEdit () {
        this.editMode = true;
      },

      onSave () {
        this.editMode = false;

        if (this.currentVideoValue && this.currentVideoValue.length > 0) {
          this.$emit(this.EVENT.UPDATE, {
            index: this.index,
            content: {
              ...this.content,
              videoType: this.content.videoType || this.VIDEO_TYPES[this.selectedVideoTypeIndex].value,
              video: this.currentVideoValue,
              caption: this.caption,
              credits: this.credits,
            },
          });
        } else if (!this.content.video) {
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

  $componentName: 'VideoContent';

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

    &__raw {
      padding-bottom: 56.25%;
      position: relative;

      video {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
    }

    &__select {
      margin-bottom: 35px;
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
