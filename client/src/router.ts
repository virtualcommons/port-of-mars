import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import WaitingLobby from '@/views/WaitingLobby.vue';
import Game from '@/views/Game.vue';
import Tutorial from '@/views/Tutorial.vue';
import store from '@/store'
import {AjaxRequest} from "@/plugins/ajax";
import {
  GAME_PAGE,
  LOBBY_PAGE,
  LOGIN_PAGE,
  PAGE_META,
  REGISTER_PAGE,
  TUTORIAL_PAGE
} from "@port-of-mars/shared/routes";
import Register from "@/views/Register.vue";

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  routes: [
    { ...PAGE_META[LOGIN_PAGE], component: Login },
    { ...PAGE_META[LOBBY_PAGE], component: WaitingLobby },
    { ...PAGE_META[GAME_PAGE], component: Game },
    { ...PAGE_META[TUTORIAL_PAGE], component: Tutorial },
    { ...PAGE_META[REGISTER_PAGE], component: Register }
  ]
});

export default router;
