import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import WaitingLobby from '@/views/WaitingLobby.vue';
import GameDashboard from '@/views/GameDashboard.vue';
import TutorialQuiz from '@/views/TutorialQuiz.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/lobby',
      name: 'WaitingLobby',
      component: WaitingLobby
    },
    {
      path: '/game',
      name: 'GameDashboard',
      component: GameDashboard
    },
    {
      path: '/quiz',
      name: 'TutorialQuiz',
      component: TutorialQuiz
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    // },
  ]
});
