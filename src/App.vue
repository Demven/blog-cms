<template>
  <div id="app" class="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style lang="scss">
  @import './styles/fonts';
  @import './styles/colors';

  html {
    font-size: 10px;
    padding: 0;
    margin: 0;
  }

  body {
    width: 100%;
    padding: 0;
    margin: 0;
    overflow-x: hidden;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  p,
  figure {
    margin: 0;
    padding: 0;
    font-weight: normal;
  }

  *::selection {
    color: $color-white;
    background: $color-aquamarine;
  }

  input::-webkit-input-placeholder { color: currentColor; }
  input::-moz-placeholder { color: currentColor; } /* Firefox 19+ */
  input:-moz-placeholder { color: currentColor; } /* Firefox 18- */
  input:-ms-input-placeholder { color: currentColor; }

  .app {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
  }
</style>
