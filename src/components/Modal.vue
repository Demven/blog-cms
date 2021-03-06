<template>
  <div :class="className">
    <div class="Modal__content">
      <div class="Modal__top-gradient"></div>
      <a
        class="Modal__close-button"
        @click="onClose"
      ></a>

      <slot></slot>
    </div>
  </div>
</template>

<script>
  import classNames from 'classnames';

  export default {
    name: 'Modal',
    props: {
      flat: Boolean,
      allSpaceOnMobile: Boolean,
    },
    // events: close
    data () {
      return {
        className: classNames('Modal', {
          'Modal--flat': this.flat,
          'Modal--all-space-on-mobile': this.allSpaceOnMobile,
        }),
      };
    },
    methods: {
      onClose () {
        this.$emit('close');
      }
    },
  };
</script>

<style lang="scss">
  @import '../styles/colors';
  @import '../styles/media';

  $componentName: 'Modal';

  $modal-offset: 2em;
  $modal-mobile-offset: 1em;

  .#{$componentName} {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: $modal-offset;
    box-sizing: border-box;

    @include media($mobile-any) {
      padding: 1em;
    }

    &--all-space-on-mobile {
      padding: 0;
    }

    &__content {
      width: 100%;
      min-height: calc(100vh - #{$modal-offset} * 2);
      position: relative;
      background: $color-white;
      box-shadow: 0 0 8px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;

      @include media($mobile-any) {
        min-height: calc(100vh - #{$modal-mobile-offset} * 2);
      }

      .#{$componentName}--flat & {
        box-shadow: none;
      }
    }

    &__top-gradient {
      width: 100%;
      height: 20em;
      position: absolute;
      top: 0;
      left: 0;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0));
      z-index: 5;
    }

    &__close-button {
      width: 6em;
      height: 6em;
      position: absolute;
      top: 1em;
      right: 1em;
      color: $color-white;
      z-index: 10;

      &:before {
        content: '';
        width: 0.2em;
        height: 6.6em;
        position: absolute;
        top: -0.3em;
        left: 2.9em;
        background: currentColor;
        transform: rotate(45deg);
      }

      &:after {
        content: '';
        width: 0.2em;
        height: 6.6em;
        position: absolute;
        top: -0.3em;
        right: 2.9em;
        background: currentColor;
        transform: rotate(-45deg);
      }

      &:hover {
        cursor: pointer;
        opacity: 0.7;
      }

      @include media($tablet-any) {
        font-size: 0.8em;
      }

      @include media($mobile-any) {
        font-size: 0.6em;
      }

      @include media($sub-mobile) {
        font-size: 0.55em;
      }
    }
  }
</style>
