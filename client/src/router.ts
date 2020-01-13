import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import WaitingLobby from '@/views/WaitingLobby.vue';
import Game from '@/views/Game.vue';
import TutorialQuiz from '@/views/TutorialQuiz.vue';
import Tutorial from "@/views/Tutorial.vue";

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
      name: 'Game',
      component: Game
    },
    {
      path: '/quiz',
      name: 'TutorialQuiz',
      component: TutorialQuiz
    },
    {
      path: '/tutorial',
      name: 'Tutorial',
      component: Tutorial
    }
  ]
});
