import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import clientStorage, { STORAGE_KEY } from './services/client-storage';
import userService from './services/user-service';

function protectRoute (optionalRedirect) {
  return (to) => {
    const token = clientStorage.get(STORAGE_KEY.AUTH_TOKEN);
    const isLoginPage = to.path === '/login';

    if (isLoginPage) {
      return true;
    } else if (!token && !isLoginPage) {
      return '/login';
    }

    return userService.validateToken(token)
      .then(valid => {
        if (valid) {
          return optionalRedirect || true;
        } else {
          return '/logout';
        }
      })
      .catch(() => '/logout');
  };
}

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/homepage'
    },
    {
      path: '/login',
      component: LoginPage,
      meta: {
        title: 'Enter the God Mode',
      },
      beforeEnter: protectRoute('/homepage'),
    },
    {
      path: '/logout',
      beforeEnter: () => {
        userService.logout();
        return '/login';
      },
    },
    {
      path: '/homepage',
      component: HomePage,
      meta: {
        title: 'Edit Home page',
      },
      beforeEnter: protectRoute(),
    },
    {
      path: '/article',
      component: ArticlePage,
      meta: {
        title: 'Create an article',
      },
      beforeEnter: protectRoute(),
    },
    {
      path: '/article/:slug',
      component: ArticlePage,
      meta: {
        title: 'Edit an article',
      },
      beforeEnter: protectRoute(),
    },
  ],
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Dmitry Salnikov - Personal Blog';

  next();
});

export default router;
