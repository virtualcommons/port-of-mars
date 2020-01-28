import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import WaitingLobby from '@/views/WaitingLobby.vue';
import Game from '@/views/Game.vue';
import TutorialQuiz from '@/views/TutorialQuiz.vue';
import Tutorial from "@/views/Tutorial.vue";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/lobby',
      name: 'WaitingLobby',
      component: WaitingLobby,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/game',
      name: 'Game',
      component: Game,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/quiz',
      name: 'TutorialQuiz',
      component: TutorialQuiz,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/tutorial',
      name: 'Tutorial',
      component: Tutorial,
      meta: {
        requiresAuth: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.requiresAuth) {
    if (localStorage.getItem('jwt')) {
      next()
    } else {
      next({
        name: 'Login'
      })
    }
  } else {
    next()
  }
});

export default router;
