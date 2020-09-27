<template>
  <div :class="className">
    <label
      class="TextField__label"
      :for="name"
    >
      {{label}}
    </label>

    <input
      class="TextField__field"
      :id="name"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      @focus="onFocus"
      @keyup="onKeyUp"
      @blur="onBlur"
      :value="value"
    />

    <div class="TextField__error">{{errorText}}</div>
  </div>
</template>

<script>
  import classNames from 'classnames';

  export default {
    name: 'TextField',
    props: {
      name: String,
      label: String,
      value: String,
      placeholder: String,
      required: Boolean,
      typePassword: Boolean,
      errorText: String,
    },
    // events: focus, change, enter-key, blur
    data () {
      return {
        className: classNames('TextField', {
          'TextField--with-error': this.errorText,
        }),
        type: this.typePassword ? 'password' : 'text',
      };
    },
    methods: {
      onFocus (event) {
        this.$emit('focus', event);
      },

      onKeyUp(event) {
        const value = event.target.value;

        if (this.name) {
          this.$emit('change', { name: this.name, value });
        }

        if (event.key === 'Enter') {
          this.$emit('enter-key', this.name);
        }
      },

      onBlur(event) {
        this.$emit('blur', event);
      },
    },
  };
</script>

<style lang="scss">
  @import '../styles/colors';
  @import '../styles/media';
  @import '../styles/typography';

  $componentName: 'TextField';

  .#{$componentName} {
    display: flex;
    flex-direction: column;

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

    &__error {
      display: none;
      padding-top: 5px;
      font-family: $font-dincyr-regular;
      font-size: 12px;
      color: $color-red;
    }

    .#{$componentName}--with-error & {
      display: block;
    }
  }
</style>
