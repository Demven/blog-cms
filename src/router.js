import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import clientStorage, { STORAGE_KEY } from './services/client-storage';
import userService from './services/user-service';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/homepage/edit'
    },
    {
      path: '/login',
      component: LoginPage,
      meta: {
        title: 'Enter the God Mode',
      },
      beforeEnter: (to, from, next) => {
        const token = clientStorage.get(STORAGE_KEY.AUTH_TOKEN);

        if (!token) return next();

        return userService.validateToken(token)
          .then(valid => {
            if (!valid) {
              next('/logout');
            }

            next('/homepage/edit');
          })
          .catch(() => {
            next('/logout');
          });
      }
    },
    {
      path: '/logout',
      beforeEnter: (to, from, next) => {
        userService.logout();
        next('/login');
      },
    },
    {
      path: '/homepage/edit',
      component: HomePage,
      meta: {
        title: 'Edit Home page',
      },
      beforeEnter: (to, from, next) => {
        const token = clientStorage.get(STORAGE_KEY.AUTH_TOKEN);

        if (!token) return next('/login');

        return userService.validateToken(token)
          .then(valid => {
            if (!valid) {
              next('/logout');
            }

            next();
          })
          .catch(() => {
            next('/logout');
          });
      }
    },
  ]
});

router.beforeEach((to, from, next) => {
  // const token = localStorage.getItem("token");
  // if (!token && to.path !== '/login') next('/login');
  // else next();

  document.title = to.meta.title || 'Dmitry Salnikov - Personal Blog';

  next();
});

export default router;
