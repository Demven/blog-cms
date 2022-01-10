<template>
  <div :class="className" v-if="values && values.length">
    <label
       class="SelectField__label"
       :for="name"
    >
      {{label}}
    </label>

    <div
       class="SelectField__field"
       @click="openList"
       tabindex="0"
    >
      {{values && values.length && values[selectedIndex].text}}
    </div>

    <ul class="SelectField__list">
      <li
         class="SelectField__item"
         v-for="(itemValue, index) in values"
         :key="index"
         :data-index="index"
         @click="onSelect"
      >{{itemValue.text}}</li>
    </ul>

    <div class="SelectField__error">{{errorText}}</div>
  </div>
</template>

<script>
  import classNames from 'classnames';

  export default {
    name: 'SelectField',
    props: {
      name: String,
      label: String,
      selectedIndex: Number,
      values: Array,
      errorText: String,
    },
    data () {
      return {
        open: false,
        EVENT: {
          SELECT: 'select',
        },
      };
    },
    computed: {
      className() {
        return classNames('SelectField', {
          'SelectField--open': this.open,
          'SelectField--with-error': this.errorText,
        });
      },
    },
    methods: {
      openList (event) {
        event.stopPropagation();

        this.open = true;

        window.document.addEventListener('keyup', this.onKeyUp);
        window.document.addEventListener('click', this.onOuterClick);
      },

      closeList () {
        this.open = false;

        window.document.removeEventListener('keyup', this.onKeyUp);
        window.document.removeEventListener('click', this.onOuterClick);
      },

      onKeyUp (event) {
        if (event.key === 'Escape') {
          this.closeList();
        }
      },

      onSelect (event) {
        const selectedIndex = event.target.dataset.index;

        this.$emit(this.EVENT.SELECT, selectedIndex);

        this.closeList();
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

  $componentName: 'SelectField';

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
      width: 100%;
      padding: 8px 10px 8px 0;
      position: relative;
      font-family: $font-dincyr-regular;
      font-size: 16px;
      text-transform: capitalize;
      border-bottom: 1px solid $color-dark-grey;
      color: $color-black-darker;
      transition: border-color 0.3s;
      box-sizing: border-box;
      cursor: pointer;

      &:focus {
        outline: none;
        border-bottom: 2px solid $color-aquamarine;
      }

      &:after {
        content: '';
        display: block;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid $color-grey;
        position: absolute;
        top: 50%;
        right: 0;
      }

      &:hover:after {
        border-top-color: $color-dark-grey;
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
      top: 30px;
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
