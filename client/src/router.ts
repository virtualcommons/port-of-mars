import Vue from 'vue';
import Router from 'vue-router';
import LoginPage from '@/views/LoginPage.vue';
import GameDashboard from '@/views/GameDashboard.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      meta: { layout: 'default-layout' },
      component: LoginPage,
    },
    {
      path: '/game',
      name: 'GameDashboard',
      meta: { layout: 'default-layout' },
      component: GameDashboard,
    },
    {
      path: '/tutorial',
      name: 'Tutorial',
      meta: { layout: 'tutorial-layout' },
      component: GameDashboard,
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    // },
  ],
});
