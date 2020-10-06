<template>
  <nav class="Nav">
    <router-link class="Nav__logo-container" to="/">
      <img
        class="Nav__logo"
        src="/images/logo.png"
      />
    </router-link>

    <h1 class="Nav__title">
      {{(title && title.length) ? title : 'Create a new article'}}
    </h1>

    <button
       class="Nav__publish-button"
       @click="onPublish"
    >
      Publish
    </button>

    <button
       class="Nav__preview-button"
       @click="onPreview"
    >
      Preview
    </button>
  </nav>
</template>

<script>
  export default {
    name: 'Nav',
    props: {
      title: String,
    },
    // events: publish, preview
    methods: {
      onPublish () {
        this.$emit('publish');
      },

      onPreview () {
        this.$emit('preview');
      }
    },
  };
</script>

<style lang="scss">
  @import '../styles/colors';
  @import '../styles/media';
  @import '../styles/typography';

  $componentName: 'Nav';

  @mixin edit-nav-button {
    -webkit-appearance: none;
    appearance: none;
    padding: 12px 20px;
    border-radius: 4px;
    border: 0;
    outline: 0;
    font-family: $font-dincyr-bold;
    font-size: 14px;
    text-transform: uppercase;
    color: $color-white;
    transition: box-shadow 0.3s;
    cursor: pointer;

    &:hover {
      box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.2);
    }
  }

  .#{$componentName} {
    width: 100%;
    height: 70px;
    background: $color-white;
    display: flex;
    flex-direction: row;
    align-items: center;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.05);

    &__logo-container {
      width: 54px;
      height: 50px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
      margin-left: 10px;
      background: $color-white;
      border: 2px solid $color-black;
      border-radius: 50%;
      box-sizing: border-box;
      z-index: 10;
    }

    &__logo {
      width: 36px;
    }

    &__title {
      font-family: $font-dincyr-bold;
      font-size: 24px;
      color: $color-black-darker;
      margin: 0 auto;
      padding-left: 113px;
    }

    &__publish-button {
      @include edit-nav-button;

      margin: 0 15px 0 0;
      background: $color-green;
    }

    &__preview-button {
      @include edit-nav-button;

      margin: 0 20px 0 0;
      background: $color-aquamarine;
    }
  }
</style>
