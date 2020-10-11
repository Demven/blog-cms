import Vue from 'vue';
import TextareaAutosize from 'vue-textarea-autosize';
import App from './App.vue';
import router from './router';

if (typeof window !== 'undefined') {
  if (window.location.protocol !== 'https:') {
    window.location.href = window.location.href.replace('http:', 'https:');
  }
}

Vue.use(TextareaAutosize);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
