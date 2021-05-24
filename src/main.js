import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { env } from './env';

if (env.NODE_ENV !== 'development' && typeof window !== 'undefined') {
  if (window.location.protocol !== 'https:') {
    window.location.href = window.location.href.replace('http:', 'https:');
  }
}

createApp(App)
  .use(router)
  .mount('#app');
