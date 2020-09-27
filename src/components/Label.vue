<template>
  <div :class="className">
    <div class="Label__text">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import classNames from 'classnames';

  export default {
    name: 'Label',
    props: {
      small: Boolean,
      blue: Boolean,
      red: Boolean,
      green: Boolean,
    },
    data () {
      return {
        className: classNames('Label', {
          'Label--small': this.small,
          'Label--blue': this.blue,
          'Label--red': this.red,
          'Label--green': this.green,
        }),
      };
    }
  };
</script>

<style lang="scss">
  @import '../styles/colors';
  @import '../styles/media';
  @import '../styles/typography';

  $componentName: 'Label';

  .#{$componentName} {
    width: auto;
    height: auto;
    position: absolute;
    left: 0;
    top: 0;
    padding-right: 1.5em;
    text-transform: uppercase;
    font-family: $font-cormorant-bold;
    font-size: 3em;
    overflow: hidden;
    z-index: 10;

    @include media($mobile) {
      font-size: 1.7em;
    }

    @include media($mobile-wide) {
      font-size: 2em;
    }

    @include media($tablet) {
      font-size: 2.2em;
    }

    @include media($tablet-wide) {
      font-size: 2.6em;
    }

    @include media($desktop) {
      font-size: 2.6em;
    }

    &--small {
      font-size: 2em;
    }

    &__text {
      padding: 0.2em 1.6em 0.2em 1.2em;
      background: $color-aquamarine;
      color: $color-white;

      &:after {
        content: '';
        display: block;
        width: 1.6em;
        height: 2em;
        position: absolute;
        right: 0.75em;
        bottom: 0.28em;
        background: $color-aquamarine;
        transform: rotate(35deg);
      }

      .#{$componentName}--blue & {
        background: $color-aquamarine;

        &:after {
          background: $color-aquamarine;
        }
      }

      .#{$componentName}--green & {
        background: $color-green;

        &:after {
          background: $color-green;
        }
      }

      .#{$componentName}--red & {
        background: $color-red;

        &:after {
          background: $color-red;
        }
      }
    }
  }
</style>
