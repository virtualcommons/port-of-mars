import Vue from "vue";
import VueRouter from "vue-router";
import Admin from "@port-of-mars/client/views/Admin.vue";
import Overview from "@port-of-mars/client/views/admin/Overview.vue";
import Rooms from "@port-of-mars/client/views/admin/Rooms.vue";
import Reports from "@port-of-mars/client/views/admin/Reports.vue";
import Settings from "@port-of-mars/client/views/admin/Settings.vue";
import Login from "@port-of-mars/client/views/Login.vue";
import Lobby from "@port-of-mars/client/views/Lobby.vue";
import Game from "@port-of-mars/client/views/Game.vue";
import Register from "@port-of-mars/client/views/Register.vue";
import Dashboard from "@port-of-mars/client/views/Dashboard.vue";
import Verify from "@port-of-mars/client/views/VerifyEmail.vue";
import Manual from "@port-of-mars/client/views/Manual.vue";
import Home from "@port-of-mars/client/views/Home.vue";
import Privacy from "@port-of-mars/client/views/Privacy.vue";
import store from "@port-of-mars/client/store";
import {
  ADMIN_PAGE,
  PAGE_META,
  LOGIN_PAGE,
  LOBBY_PAGE,
  GAME_PAGE,
  REGISTER_PAGE,
  DASHBOARD_PAGE,
  VERIFY_PAGE,
  MANUAL_PAGE,
  HOME_PAGE,
  ABOUT_PAGE,
  PRIVACY_PAGE,
} from "@port-of-mars/shared/routes";

Vue.use(VueRouter);

const ADMIN_META = PAGE_META[ADMIN_PAGE].meta;

const router = new VueRouter({
  mode: "hash",
  routes: [
    { ...PAGE_META[ADMIN_PAGE], component: Admin, children: [
      { path: "", name: "Admin", redirect: { name: "AdminOverview" }, meta: ADMIN_META },
      { path: "overview", name: "AdminOverview", component: Overview, meta: ADMIN_META },
      { path: "rooms", name: "AdminRooms", component: Rooms, meta: ADMIN_META },
      { path: "reports", name: "AdminReports", component: Reports, meta: ADMIN_META },
      { path: "settings", name: "AdminSettings", component: Settings, meta: ADMIN_META },
    ] },
    { ...PAGE_META[LOGIN_PAGE], component: Login },
    { ...PAGE_META[LOBBY_PAGE], component: Lobby },
    { ...PAGE_META[GAME_PAGE], component: Game },
    { ...PAGE_META[REGISTER_PAGE], component: Register },
    { ...PAGE_META[DASHBOARD_PAGE], component: Dashboard },
    { ...PAGE_META[VERIFY_PAGE], component: Verify },
    { ...PAGE_META[MANUAL_PAGE], component: Manual },
    { ...PAGE_META[HOME_PAGE], component: Home },
    { ...PAGE_META[ABOUT_PAGE], component: Home },
    { ...PAGE_META[PRIVACY_PAGE], component: Privacy },
  ]
});

function isAuthenticated() {
  return store.getters.isAuthenticated;
}

function isAdmin() {
  return store.getters.isAdmin;
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
    next({ name: LOGIN_PAGE });
  } else if (to.name === LOGIN_PAGE && isAuthenticated()) {
    next({ name: DASHBOARD_PAGE });
  } else if (to.meta.requiresAdmin && !isAdmin()) {
    next({ name: HOME_PAGE });
  } else {
    next();
  }
});

export default router;
