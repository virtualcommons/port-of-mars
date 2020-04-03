import Vue from 'vue';
import Router from 'vue-router';
import Login from '@port-of-mars/client/views/Login.vue';
import WaitingLobby from '@port-of-mars/client/views/WaitingLobby.vue';
import Game from '@port-of-mars/client/views/Game.vue';
import Tutorial from '@port-of-mars/client/views/Tutorial.vue';
import PlayerDashboard from '@port-of-mars/client/views/PlayerDashboard.vue';


import {
  GAME_PAGE,
  LOBBY_PAGE,
  LOGIN_PAGE,
  PAGE_META,
  REGISTER_PAGE,
  TUTORIAL_PAGE,
  PLAYER_DASHBOARD,
  // REFACTOR_UI
} from "@port-of-mars/shared/routes";
import Register from "@port-of-mars/client/views/Register.vue";

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  routes: [
    { ...PAGE_META[LOGIN_PAGE], component: Login },
    { ...PAGE_META[LOBBY_PAGE], component: WaitingLobby },
    { ...PAGE_META[GAME_PAGE], component: Game },
    { ...PAGE_META[TUTORIAL_PAGE], component: Tutorial },
    { ...PAGE_META[REGISTER_PAGE], component: Register },
    { ...PAGE_META[PLAYER_DASHBOARD], component: PlayerDashboard },
    // { ...PAGE_META[REFACTOR_UI], component: Game},
  ]
});

export default router;
