import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import WaitingLobby from '@/views/WaitingLobby.vue';
import Game from '@/views/Game.vue';
import Tutorial from '@/views/Tutorial.vue';
import store from '@/store'
import {AjaxRequest} from "@/plugins/ajax";

Vue.use(Router);

const router = new Router({
  mode: 'hash',
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
  const $ajax = new AjaxRequest(router, store);
  const jwt = $ajax.loginCreds?.token;
  if (to.meta?.requiresAuth && !jwt) {
    next({
      name: 'Login'
    });
  } else {
    next();
  }
});

export default router;
