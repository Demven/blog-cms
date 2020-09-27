<template>
  <div class="HomePage">
    <h1>Edit Home Page</h1>

    <Toast :event-bus="toastEventBus"></Toast>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Toast from '../components/Toast.vue';

  export default {
    name: 'HomePage',
    components: {
      Toast,
    },
    data () {
      return {
        toastEventBus: new Vue(),
      };
    },
    methods: {

    }
  };
</script>

<style lang="scss">
  .HomePage {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(0, 0, 0, 0.02);
  }
</style>