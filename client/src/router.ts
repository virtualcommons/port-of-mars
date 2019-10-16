import Vue from 'vue';
import Router from 'vue-router';
import LoginPage from '@/views/LoginPage.vue';
import GameDashboard from '@/views/GameDashboard.vue'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: LoginPage,
    },
    {
      path: '/gb',
      name: 'GameDashboard',
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
