<template>
  <div :class="className">
    <label
      class="AutoComplete__label"
      :for="name"
    >
      {{label}}
    </label>

    <input
      class="AutoComplete__field"
      :id="name"
      :placeholder="placeholder"
      :required="required"
      @focus="onFocus"
      @keyup="onKeyUp"
      @blur="onBlur"
      :value="value"
    />

    <ul
      class="AutoComplete__list"
      v-if="items.length"
    >
      <li
         class="AutoComplete__item"
         v-for="(item, index) in items"
         :key="item.value"
         :data-index="index"
         @click="onSelect"
      >
        {{item.text}}
      </li>
    </ul>

    <div class="TextField__error">{{errorText}}</div>
  </div>
</template>

<script>
  import classNames from 'classnames';

  export default {
    name: 'AutoComplete',
    props: {
      name: String,
      label: String,
      value: String,
      items: Array,
      placeholder: String,
      required: Boolean,
      errorText: String,
    },
    data () {
      return {
        open: false,
        EVENT: {
          FOCUS: 'focus',
          CHANGE: 'change',
          BLUR: 'blur',
          SELECT: 'select',
          ENTER: 'enter',
        },
      };
    },
    computed: {
      className() {
        return classNames('AutoComplete', {
          'AutoComplete--open': this.open,
          'AutoComplete--with-error': this.errorText,
        });
      },
    },
    methods: {
      onFocus(event) {
        this.$emit(this.EVENT.FOCUS, event);
      },

      onSelect (event) {
        const selectedIndex = event.target.dataset.index;

        this.$emit(this.EVENT.SELECT, { name: this.name, selectedIndex });
        this.closeList();
      },

      onBlur (event) {
        this.$emit(this.EVENT.BLUR, event);
      },

      openList () {
        this.open = true;

        window.document.addEventListener('keyup', this.onKeyUp);
        window.document.addEventListener('click', this.onOuterClick);
      },

      closeList () {
        this.open = false;

        window.document.removeEventListener('keyup', this.onKeyUp);
        window.document.removeEventListener('click', this.onOuterClick);
      },

      onKeyUp(event) {
        const value = event.target.value;

        if (event.key === 'Escape') {
          this.closeList();
          return;
        }

        if (event.key === 'Enter') {
          this.closeList();
          this.$emit(this.EVENT.ENTER, { name: this.name, value });
          return;
        }

        if (this.name) {
          if (value.trim()) {
            this.openList();
          } else {
            this.closeList();
          }

          this.$emit(this.EVENT.CHANGE, { name: this.name, value });
        }
      },

      onOuterClick () {
        this.closeList();
      },
    },
  };
</script>

<style lang="scss">
  @import '../styles/colors';
  @import '../styles/media';
  @import '../styles/typography';

  $componentName: 'AutoComplete';

  .#{$componentName} {
    width: 350px;
    display: flex;
    flex-direction: column;
    position: relative;

    &__label {
      font-family: $font-dincyr-bold;
      font-size: 14px;
      color: $color-aquamarine;

      .#{$componentName}--with-error & {
        color: $color-red;
      }
    }

    &__field {
      -webkit-appearance: none;
      width: 100%;
      padding: 8px 10px 8px 0;
      outline: none;
      font-family: $font-dincyr-regular;
      font-size: 16px;
      border: 0;
      border-bottom: 1px solid $color-dark-grey;
      color: $color-black-darker;
      transition: border-color 0.3s;
      box-sizing: border-box;

      &:focus {
        border-bottom: 2px solid $color-aquamarine;
      }

      &::placeholder {
        color: $color-dark-grey;
      }

      .#{$componentName}--with-error & {
        border-color: $color-red;
      }
    }

    &__list {
      width: 100%;
      display: none;
      flex-direction: column;
      padding: 10px 0;
      margin: 0;
      position: absolute;
      top: 61px;
      list-style: none;
      background: $color-white;
      box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
      z-index: 10;

      .#{$componentName}--open & {
        display: flex;
      }
    }

    &__item {
      width: 100%;
      padding: 6px 10px;
      font-family: $font-dincyr-regular;
      font-size: 16px;
      text-transform: capitalize;
      box-sizing: border-box;
      transition: background-color 0.4s;
      cursor: pointer;

      &:hover {
        background-color: $color-light-grey;
      }
    }

    &__error {
      display: none;
      padding-top: 5px;
      font-family: $font-dincyr-regular;
      font-size: 12px;
      color: $color-red;

      .#{$componentName}--with-error & {
        display: block;
      }
    }
  }
</style>
