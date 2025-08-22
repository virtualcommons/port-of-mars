import Vue from "vue";
import VueRouter, { NavigationGuardNext } from "vue-router";
import Admin from "@port-of-mars/client/views/Admin.vue";
import Overview from "@port-of-mars/client/views/admin/Overview.vue";
import Games from "@port-of-mars/client/views/admin/Games.vue";
import Rooms from "@port-of-mars/client/views/admin/Rooms.vue";
import Reports from "@port-of-mars/client/views/admin/Reports.vue";
import Settings from "@port-of-mars/client/views/admin/Settings.vue";
import Studies from "@port-of-mars/client/views/admin/Studies.vue";
import Login from "@port-of-mars/client/views/Login.vue";
import Leaderboard from "@port-of-mars/client/views/Leaderboard.vue";
import PlayerHistory from "@port-of-mars/client/views/PlayerHistory.vue";
import FreePlayLobby from "@port-of-mars/client/views/FreePlayLobby.vue";
import TournamentLobby from "@port-of-mars/client/views/TournamentLobby.vue";
import TournamentDashboard from "@port-of-mars/client/views/TournamentDashboard.vue";
import LobbyRoom from "@port-of-mars/client/components/lobby/LobbyRoom.vue";
import LobbyRoomList from "@port-of-mars/client/components/lobby/LobbyRoomList.vue";
import Game from "@port-of-mars/client/views/Game.vue";
import SoloGame from "@port-of-mars/client/views/SoloGame.vue";
import Consent from "@port-of-mars/client/views/Consent.vue";
import Verify from "@port-of-mars/client/views/VerifyEmail.vue";
import Manual from "@port-of-mars/client/views/Manual.vue";
import Home from "@port-of-mars/client/views/Home.vue";
import Privacy from "@port-of-mars/client/views/Privacy.vue";
import Profile from "@port-of-mars/client/views/Profile.vue";
import ProlificSoloStudy from "@port-of-mars/client/views/ProlificSoloStudy.vue";
import ProlificMultiplayerStudy from "@port-of-mars/client/views/ProlificMultiplayerStudy.vue";
import ProlificInteractiveStudy from "@port-of-mars/client/views/ProlificInteractiveStudy.vue";
import store from "@port-of-mars/client/store";
import {
  ADMIN_PAGE,
  PAGE_META,
  LOGIN_PAGE,
  FREE_PLAY_LOBBY_PAGE,
  TOURNAMENT_LOBBY_PAGE,
  TOURNAMENT_DASHBOARD_PAGE,
  GAME_PAGE,
  SOLO_GAME_PAGE,
  LEADERBOARD_PAGE,
  PLAYER_HISTORY_PAGE,
  CONSENT_PAGE,
  VERIFY_PAGE,
  MANUAL_PAGE,
  HOME_PAGE,
  ABOUT_PAGE,
  PRIVACY_PAGE,
  PROFILE_PAGE,
  PROLIFIC_SOLO_STUDY_PAGE,
  PROLIFIC_MULTIPLAYER_STUDY_PAGE,
  PROLIFIC_INTERACTIVE_STUDY_PAGE,
} from "@port-of-mars/shared/routes";

Vue.use(VueRouter);

const ADMIN_META = PAGE_META[ADMIN_PAGE].meta;
const FREE_PLAY_LOBBY_META = PAGE_META[FREE_PLAY_LOBBY_PAGE].meta;

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
        { path: "studies", name: "AdminStudies", component: Studies, meta: ADMIN_META },
      ],
    },
    { ...PAGE_META[LOGIN_PAGE], component: Login },
    {
      path: PAGE_META[FREE_PLAY_LOBBY_PAGE].path,
      meta: PAGE_META[FREE_PLAY_LOBBY_PAGE].meta,
      component: FreePlayLobby,
      children: [
        {
          path: "",
          name: FREE_PLAY_LOBBY_PAGE,
          component: LobbyRoomList,
          meta: FREE_PLAY_LOBBY_META,
        },
        {
          path: "room/:id",
          name: "FreePlayLobbyRoom",
          component: LobbyRoom,
          meta: FREE_PLAY_LOBBY_META,
          props: true,
        },
      ],
    },
    { ...PAGE_META[TOURNAMENT_LOBBY_PAGE], component: TournamentLobby },
    { ...PAGE_META[TOURNAMENT_DASHBOARD_PAGE], component: TournamentDashboard },
    { ...PAGE_META[GAME_PAGE], component: Game },
    { ...PAGE_META[SOLO_GAME_PAGE], component: SoloGame },
    { ...PAGE_META[LEADERBOARD_PAGE], component: Leaderboard },
    { ...PAGE_META[PLAYER_HISTORY_PAGE], component: PlayerHistory },
    { ...PAGE_META[CONSENT_PAGE], component: Consent },
    { ...PAGE_META[VERIFY_PAGE], component: Verify },
    { ...PAGE_META[MANUAL_PAGE], component: Manual },
    { ...PAGE_META[HOME_PAGE], component: Home },
    { ...PAGE_META[ABOUT_PAGE], component: Home },
    { ...PAGE_META[PRIVACY_PAGE], component: Privacy },
    { ...PAGE_META[PROFILE_PAGE], component: Profile },
    { ...PAGE_META[PROLIFIC_SOLO_STUDY_PAGE], component: ProlificSoloStudy },
    { ...PAGE_META[PROLIFIC_MULTIPLAYER_STUDY_PAGE], component: ProlificMultiplayerStudy },
    {
      ...PAGE_META[PROLIFIC_INTERACTIVE_STUDY_PAGE],
      component: ProlificInteractiveStudy,
    },
  ],
});

function isFreePlayEnabled() {
  return store.state.isFreePlayEnabled;
}

function isTournamentEnabled() {
  return store.state.isTournamentEnabled;
}

function isAuthenticated() {
  return store.getters.isAuthenticated;
}

function isAdmin() {
  return store.getters.isAdmin;
}

function hasConsented() {
  return store.getters.hasConsented;
}

router.beforeEach((to: any, from: any, next: NavigationGuardNext) => {
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

router.beforeEach((to: any, from: any, next: NavigationGuardNext) => {
  // somewhat ugly but alternatives are worse, consider cleaning up the whole router
  // setup at some point as its been gradually outgrowing the original design
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: LOGIN_PAGE });
  } else if (to.meta.requiresConsent && !hasConsented()) {
    next({ name: CONSENT_PAGE });
  } else if (to.meta.requiresAdmin && !isAdmin()) {
    next({ name: HOME_PAGE });
  } else if (to.meta.requiresTournamentEnabled && !isTournamentEnabled()) {
    next({ name: HOME_PAGE });
  } else if (to.meta.requiresFreePlayEnabled && !isFreePlayEnabled()) {
    next({ name: HOME_PAGE });
  } else if (to.name === LOGIN_PAGE && isAuthenticated()) {
    next({ name: HOME_PAGE });
  } else {
    next();
  }
});

export default router;
