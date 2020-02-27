import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import WaitingLobby from '@/views/WaitingLobby.vue';
import Game from '@/views/Game.vue';
import Tutorial from '@/views/Tutorial.vue';
import store from '@/store'
import {AjaxRequest} from "@/plugins/ajax";
import {GAME_PAGE, LOBBY_PAGE, LOGIN_PAGE, PAGE_META, TUTORIAL_PAGE} from "shared/routes";

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  routes: [
    { ...PAGE_META[LOGIN_PAGE], component: Login },
    { ...PAGE_META[LOBBY_PAGE], component: WaitingLobby },
    { ...PAGE_META[GAME_PAGE], component: Game },
    { ...PAGE_META[TUTORIAL_PAGE], component: Tutorial },
  ]
});

router.beforeEach(async (to, from, next) => {
  const $ajax = new AjaxRequest(router, store);
  const res = await $ajax.get(`${process.env.SERVER_URL_HTTP}/next-page/${to.name}`);
  const data = await res.json();
  next();
});

export default router;
