<template>
  <svg class="Icon">
    <use :xlink:href="'#' + name" />
  </svg>
</template>

<script>
  export default {
    name: 'Icon',
    props: {
      name: String,
    },
  };
</script>

<style lang="scss"></style>
