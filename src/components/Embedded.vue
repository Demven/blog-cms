<template>
  <div class="Embedded">
    <div
      :class="hostClassName"
      v-html="embed"
      ref="embedHost"
    ></div>
  </div>
</template>

<script>
  import classNames from 'classnames';

  export default {
    name: 'Embedded',
    props: {
      className: String,
      embed: String,
    },
    data () {
      return {
        hostClassName: classNames('Embedded__host', this.className),
      };
    },
    mounted () {
      if (this.embed) {
        const viewportWidth = window.innerWidth;
        const isMobile = viewportWidth <= 690;
        const isScript = this.embed.includes('<script');
        const isIframe = this.embed.includes('<iframe');

        if (isScript) {
          this.loadScriptsInEmbedded();
        }

        if (isMobile && isIframe) {
          const iframe = this.$refs.embedHost.querySelector('iframe');
          const isFacebook = this.embed.includes('facebook.com');

          if (isFacebook) {
            this.setFacebookIframeHeight(iframe);
          }

          this.setIframeWidth(iframe);
        }
      }
    },
    methods: {
      loadScriptsInEmbedded () {
        const scripts = this.$refs.embedHost.querySelectorAll('script');

        if (scripts.length > 0) {
          scripts.forEach(this.loadScript);
        }
      },

      loadScript (scriptNode) {
        const script = document.createElement('script');
        script.type = 'text/javascript';

        if (scriptNode.src) { script.src = scriptNode.src; }
        if (scriptNode.text) { script.text = scriptNode.text; }

        this.$refs.embedHost.appendChild(script);
      },

      setFacebookIframeHeight (iframe) {
        const width = iframe.offsetWidth;
        const height = iframe.offsetHeight;
        const ratio = width / height;
        const hostWidth = this.$refs.embedHost.offsetWidth;

        iframe.style.height = `${Math.round(hostWidth / ratio) + 90}px`;
      },

      setIframeWidth (iframe) {
        iframe.style.width = '100%';
      },
    },
  };
</script>

<style lang="scss">
  $componentName: 'Embedded';

  .#{$componentName} {
    &__host {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
</style>
