<template>
  <div :class="className">
    <div class="ListContent__wrapper">
      <p
        class="ListContent__content-text"
        @click="onEdit"
        v-html="formatMarkdown(text || content.text || '')"
        v-if="!editMode"
      ></p>
      <ul
        class="ListContent__items"
        @click="onEdit"
        v-if="!editMode"
      >
        <li
          v-for="(item, index) in items"
          :key="index"
          class="ListContent__item"
          v-html="formatMarkdown(item)"
        ></li>
      </ul>

      <div
        class="ListContent__text-field"
        v-if="editMode"
      >
        <TextArea
          :name="'text'"
          :label="'List'"
          :rows="1"
          :placeholder="'Optional paragraph before the list'"
          :initial-value="text || content.text"
          required
          @change="onFieldChange"
        ></TextArea>
      </div>

      <ul
        class="ListContent__item-fields"
        v-if="editMode"
      >
        <li
          v-for="(item, index) in items"
          :key="getKeyForListItem(index)"
          class="ListContent__item-field"
        >
          <TextArea
            :name="String(index)"
            :rows="1"
            :placeholder="'Item ' + (index + 1) + ' text'"
            :initial-value="item"
            required
            @change="onListItemChange"
          ></TextArea>
          
          <button
            class="ListContent__action ListContent__delete-item"
            @click="onDeleteItem(index)"
          >
            <Icon :name="ICON_REMOVE"></Icon>
          </button>
        </li>
      </ul>
    </div>

    <div class="ListContent__actions">
      <button
        class="ListContent__action ListContent__delete"
        @click="onDelete"
      >
        <Icon :name="ICON_CLOSE"></Icon>
      </button>
      <button
        class="ListContent__action ListContent__done"
        @click="onSave"
        v-if="editMode"
      >
        <Icon :name="ICON_DONE"></Icon>
      </button>
      <button
        class="ListContent__action ListContent__add-item"
        @click="onAdd"
        v-if="editMode"
      >
        <Icon :name="ICON_ADD"></Icon>
      </button>
    </div>
  </div>
</template>

<script>
  import classNames from 'classnames';
  import Icon from '../Icon/Icon';
  import { ICON } from '../Icon/icons';
  import TextArea from '../TextArea';
  import { LIST_TYPE } from './list-types';
  import { formatMarkdown } from '../../services/markdown-service';

  // class ListModel {
  //   type: string;
  //   listType: string;
  //   text: string;
  //   items: Array<string>;
  // }

  export default {
    name: 'ListContent',
    components: { TextArea, Icon },
    props: {
      index: String,
      content: Object,
    },
    data () {
      return {
        editMode: false,
        text: '',
        items: [],
        deleted: false,
        EVENT: {
          UPDATE: 'update',
          REMOVE: 'remove',
        },
        LIST_TYPE,
        ICON_ADD: ICON.ADD,
        ICON_DONE: ICON.DONE,
        ICON_CLOSE: ICON.CLOSE,
        ICON_REMOVE: ICON.REMOVE,
      };
    },
    computed: {
      className () {
        return classNames('ListContent', {
          'ListContent--edit-mode': this.editMode,
        });
      },
    },
    created () {
      if (!this.content.items && !this.items.length) {
        this.editMode = true;
        this.items = [''];
      } else if (this.content.items) {
        this.items = [...this.content.items];
      }
    },
    methods: {
      formatMarkdown (text) {
        return formatMarkdown(text);
      },

      getKeyForListItem (index) {
        let itemId;
        if (this.deleted) {
          itemId = (Math.random() * 1000).toFixed(0);
        } else {
          itemId = `${index}`;
        }

        if (this.deleted && (index + 1 === this.items.length)) {
          this.deleted = false;
        }

        return itemId;
      },

      onFieldChange ({ name, value }) {
        if (name) {
          this[name] = value;

          if (value === '') {
            this.$emit(this.EVENT.UPDATE, {
              index: this.index,
              content: {
                ...this.content,
                text: value,
              },
            });
          }
        }
      },

      onListItemChange ({ name, value }) {
        if (name && value) {
          this.items[name] = value;
        }
      },

      onEdit () {
        this.editMode = true;
      },

      onSave () {
        this.editMode = false;

        if (this.items && this.items.length > 0) {
          const content = {
            ...this.content,
            text: typeof this.text === 'undefined' ? this.content.text : this.text,
            listType: LIST_TYPE.BULLET,
            items: this.items,
          };

          this.$emit(this.EVENT.UPDATE, { index: this.index, content });
        } else if (!this.content.text) {
          this.onDelete();
        }
      },

      onAdd() {
        this.items.push('');
      },

      onDelete () {
        this.$emit(this.EVENT.REMOVE, { index: this.index });
      },

      onDeleteItem (index) {
        this.deleted = true;

        this.items.splice(index, 1); // will trigger re-render for all items with random trackId (see getKeyForListItem())
        window.setTimeout(() => {
          this.items = [...this.items]; // will trigger re-render for all items with 'index' key
        }, 100);
      },
    },
  };
</script>

<style lang="scss">
  @import '../../styles/colors';
  @import '../../styles/typography';
  @import '../../styles/markdown';

  $componentName: 'ListContent';

  .#{$componentName} {
    display: flex;
    flex-direction: row;

    &__wrapper {
      width: 660px;
    }

    &__content-text {
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

    &__items {
      margin: 0;
      font-family: $font-dincyr-regular;
      font-size: 16px;
      color: $color-black-darker;
      cursor: pointer;
    }

    &__item {
      margin-top: 5px;

      @include markdown-bold;
      @include markdown-link;
      @include markdown-code;
    }

    &__text-field {
      margin-top: 20px;
    }

    &__item-fields {
      display: flex;
      flex-direction: column;
      margin: 20px 0 0 0;
      padding-left: 36px;
      list-style: none;
    }

    &__item-field {
      width: 100%;
      display: flex;
      align-items: center;
      list-style: none;
      position: relative;

      &:before {
        content: '';
        width: 10px;
        height: 10px;
        display: block;
        background: $color-black-medium;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: -26px;
        transform: translateY(-5px);
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

    &__add-item {
      margin-top: 20px;
      margin-bottom: 8px;
      transform: scale(1.1);

      &:hover {
        & .Icon {
          color: $color-aquamarine;
        }
      }
    }

    &__delete-item {
      display: flex;
      width: 40px;
      height: 100%;
      justify-content: center;
      align-items: center;

      & .Icon {
        width: 26px;
        height: 26px;
      }
    }
  }
</style>
