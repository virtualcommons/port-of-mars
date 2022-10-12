import Vue from "vue";
import VueRouter from "vue-router";
import Admin from "@port-of-mars/client/views/Admin.vue";
import Login from "@port-of-mars/client/views/Login.vue";
import Lobby from "@port-of-mars/client/views/Lobby.vue";
import Game from "@port-of-mars/client/views/Game.vue";
import SignedUp from "@port-of-mars/client/views/SignedUp.vue";
import Tutorial from "@port-of-mars/client/views/Tutorial.vue";
import Register from "@port-of-mars/client/views/Register.vue";
import Dashboard from "@port-of-mars/client/views/Dashboard.vue";
import Verify from "@port-of-mars/client/views/VerifyEmail.vue";
import Manual from "@port-of-mars/client/views/Manual.vue";
import Home from "@port-of-mars/client/views/Home.vue";
import OpenLogin from "@port-of-mars/client/views/OpenLogin.vue";
import OpenLobby from "@port-of-mars/client/views/OpenLobby.vue";
import Onboarding from "@port-of-mars/client/views/Onboarding.vue";
import store from "@port-of-mars/client/store";
import {
  ADMIN_PAGE,
  PAGE_META,
  LOGIN_PAGE,
  LOBBY_PAGE,
  GAME_PAGE,
  TUTORIAL_PAGE,
  REGISTER_PAGE,
  DASHBOARD_PAGE,
  VERIFY_PAGE,
  SIGNEDUP_PAGE,
  MANUAL_PAGE,
  HOME_PAGE,
  OPENLOGIN_PAGE,
  OPENLOBBY_PAGE,
  ONBOARDING_PAGE
} from "@port-of-mars/shared/routes";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "hash",
  routes: [
    { ...PAGE_META[ADMIN_PAGE], component: Admin },
    { ...PAGE_META[LOGIN_PAGE], component: Login },
    { ...PAGE_META[LOBBY_PAGE], component: Lobby },
    { ...PAGE_META[GAME_PAGE], component: Game },
    { ...PAGE_META[SIGNEDUP_PAGE], component: SignedUp },
    { ...PAGE_META[TUTORIAL_PAGE], component: Tutorial },
    { ...PAGE_META[REGISTER_PAGE], component: Register },
    { ...PAGE_META[DASHBOARD_PAGE], component: Dashboard },
    { ...PAGE_META[VERIFY_PAGE], component: Verify },
    { ...PAGE_META[MANUAL_PAGE], component: Manual },
    { ...PAGE_META[HOME_PAGE], component: Home },
    { ...PAGE_META[OPENLOGIN_PAGE], component: OpenLogin },
    { ...PAGE_META[OPENLOBBY_PAGE], component: OpenLobby },
    { ...PAGE_META[ONBOARDING_PAGE], component: Onboarding }
  ]
});

function isAuthenticated() {
  return store.getters.isAuthenticated;
}

router.beforeEach((to, from, next) => {
  if (from === VueRouter.START_LOCATION) {
    console.log("initializing store");
    store
      .dispatch("init")
      .then(user => {
        console.log("store init returned user: ", user);
        next();
      })
      .catch(e => {
        console.error("Unable to initialize store: ", e);
      });
  } else {
    next();
  }
});

router.beforeEach((to: any, from: any, next: any) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: OPENLOGIN_PAGE });
  } else if (to.name === OPENLOGIN_PAGE && isAuthenticated()) {
    next({ name: DASHBOARD_PAGE });
  } else {
    next();
  }
});

export default router;
