import Vue from "vue";
import Router from "vue-router";
import Login from "@port-of-mars/client/views/Login.vue";
import Lobby from "@port-of-mars/client/views/Lobby.vue";
import Game from "@port-of-mars/client/views/Game.vue";
import SignedUp from "@port-of-mars/client/views/SignedUp.vue";
import Tutorial from "@port-of-mars/client/views/Tutorial.vue";
import Register from "@port-of-mars/client/views/Register.vue";
import Dashboard from "@port-of-mars/client/views/Dashboard.vue";
import Verify from "@port-of-mars/client/views/VerifyEmail.vue";
import {
  PAGE_META,
  LOGIN_PAGE,
  LOBBY_PAGE,
  GAME_PAGE,
  TUTORIAL_PAGE,
  REGISTER_PAGE,
  DASHBOARD_PAGE,
  VERIFY_PAGE,
  SIGNEDUP_PAGE
} from "@port-of-mars/shared/routes";

Vue.use(Router);

const router = new Router({
  mode: "hash",
  routes: [
    { ...PAGE_META[LOGIN_PAGE], component: Login },
    { ...PAGE_META[LOBBY_PAGE], component: Lobby },
    { ...PAGE_META[GAME_PAGE], component: Game },
    { ...PAGE_META[SIGNEDUP_PAGE], component: SignedUp },
    { ...PAGE_META[TUTORIAL_PAGE], component: Tutorial },
    { ...PAGE_META[REGISTER_PAGE], component: Register },
    { ...PAGE_META[DASHBOARD_PAGE], component: Dashboard },
    { ...PAGE_META[VERIFY_PAGE], component: Verify }
  ]
});

export default router;
