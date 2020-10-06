import Vue from 'vue';
import TextareaAutosize from 'vue-textarea-autosize';
import App from './App.vue';
import router from './router';

Vue.use(TextareaAutosize);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
