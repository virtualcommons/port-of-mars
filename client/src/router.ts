import Vue from "vue";
import VueRouter from "vue-router";
import Admin from "@port-of-mars/client/views/Admin.vue";
import Overview from "@port-of-mars/client/views/admin/Overview.vue";
import Games from "@port-of-mars/client/views/admin/Games.vue";
import Rooms from "@port-of-mars/client/views/admin/Rooms.vue";
import Reports from "@port-of-mars/client/views/admin/Reports.vue";
import Settings from "@port-of-mars/client/views/admin/Settings.vue";
import Login from "@port-of-mars/client/views/Login.vue";
import Leaderboard from "@port-of-mars/client/views/Leaderboard.vue";
import Lobby from "@port-of-mars/client/views/Lobby.vue";
import LobbyRoom from "@port-of-mars/client/components/lobby/LobbyRoom.vue";
import LobbyRoomList from "@port-of-mars/client/components/lobby/LobbyRoomList.vue";
import Game from "@port-of-mars/client/views/Game.vue";
import Register from "@port-of-mars/client/views/Register.vue";
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
  LEADERBOARD_PAGE,
  REGISTER_PAGE,
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
    {
      ...PAGE_META[ADMIN_PAGE],
      component: Admin,
      children: [
        { path: "", name: "Admin", redirect: { name: "AdminOverview" }, meta: ADMIN_META },
        { path: "overview", name: "AdminOverview", component: Overview, meta: ADMIN_META },
        { path: "games", name: "AdminGames", component: Games, meta: ADMIN_META },
        { path: "rooms", name: "AdminRooms", component: Rooms, meta: ADMIN_META },
        { path: "reports", name: "AdminReports", component: Reports, meta: ADMIN_META },
        { path: "settings", name: "AdminSettings", component: Settings, meta: ADMIN_META },
      ],
    },
    { ...PAGE_META[LOGIN_PAGE], component: Login },
    {
      ...PAGE_META[LOBBY_PAGE],
      component: Lobby,
      children: [
        { path: "", name: "Lobby", component: LobbyRoomList, meta: { requiresAuth: true } },
        {
          path: "room/:id",
          name: "LobbyRoom",
          component: LobbyRoom,
          meta: { requiresAuth: true },
          props: true,
        },
      ],
    },
    { ...PAGE_META[GAME_PAGE], component: Game },
    { ...PAGE_META[LEADERBOARD_PAGE], component: Leaderboard },
    { ...PAGE_META[REGISTER_PAGE], component: Register },
    { ...PAGE_META[VERIFY_PAGE], component: Verify },
    { ...PAGE_META[MANUAL_PAGE], component: Manual },
    { ...PAGE_META[HOME_PAGE], component: Home },
    { ...PAGE_META[ABOUT_PAGE], component: Home },
    { ...PAGE_META[PRIVACY_PAGE], component: Privacy },
  ],
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
    next({ name: HOME_PAGE });
  } else if (to.meta.requiresAdmin && !isAdmin()) {
    next({ name: HOME_PAGE });
  } else {
    next();
  }
});

export default router;
