<template>
  <div :class="className">
    {{message}}
  </div>
</template>

<script>
  import classNames from 'classnames';

  const DELAY = 3000;

  export default {
    name: 'Toast',
    props: {
      eventBus: Object,
    },
    data () {
      return {
        message: '',
        visible: false,
      };
    },
    computed: {
      className () {
        return classNames('Toast', {
          'Toast--visible': this.visible,
        });
      },
    },
    created () {
      this.eventBus.$on('message', this.onMessage);
    },
    methods: {
      onMessage (message) {
        console.info('message', message);

        if (message) {
          this.message = message;
          this.visible = true;

          window.setTimeout(() => {
            this.visible = false;
          }, DELAY);
        }
      }
    },
  };
</script>

<style lang="scss">
  @import '../styles/colors';
  @import '../styles/typography';

  $componentName: 'Toast';

  .#{$componentName} {
    width: auto;
    height: auto;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%) translateY(100%);
    padding: 28px 45px;
    border-radius: 4px;
    font-family: $font-dincyr-bold;
    font-size: 15px;
    line-height: 15px;
    text-align: center;
    background: $color-black-darkest;
    color: $color-white;
    opacity: 0;
    transition: transform cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.5s, opacity 0.3s;

    &--visible {
      opacity: 1;
      transform: translateX(-50%) translateY(-30px);
    }
  }
</style>
