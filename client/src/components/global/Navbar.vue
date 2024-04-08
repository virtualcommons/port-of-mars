<template>
  <b-navbar tag="header" toggleable="xl" type="dark" variant="dark" class="w-100" fixed="top">
    <b-navbar-brand :to="home">
      <b-img
        class="logo"
        v-bind="portOfMarsLogoProps"
        :src="$getAssetUrl(`images/logo-Port-of-Mars-White.svg`)"
        alt="the planet mars illustrated in white above Port of Mars"
      ></b-img>
    </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item
          class="mx-2"
          v-if="isAdmin"
          :to="admin"
          exact-active-class="active"
          title="Admin Dashboard"
        >
          Admin
        </b-nav-item>
        <b-nav-item class="mx-2" :to="about" exact-active-class="active" title="About Port of Mars"
          >About</b-nav-item
        >
        <b-nav-item class="mx-2" :to="consent" exact-active-class="active" title="Consent Form"
          >Consent</b-nav-item
        >
        <b-nav-item
          class="mx-2"
          :to="manual"
          target="_blank"
          exact-active-class="active"
          title="Game Manual"
        >
          Manual
        </b-nav-item>
        <b-nav-item class="mx-2" :to="leaderboard" exact-active-class="active" title="Leaderboard"
          >Leaderboard</b-nav-item
        >
        <b-nav-item
          class="mx-2 text-nowrap"
          :to="solo"
          exact-active-class="active"
          title="Solo Mode"
        >
          Solo Mode
        </b-nav-item>
        <b-nav-item
          v-if="isFreePlayEnabled"
          class="mx-2 text-nowrap"
          :to="freePlayLobby"
          exact-active-class="active"
          title="Free Play Game Lobby"
        >
          Free Play
        </b-nav-item>
        <b-nav-item
          v-if="isTournamentEnabled"
          class="mx-2 text-nowrap"
          link-classes="btn btn-success text-white"
          :to="tournamentDashboard"
          exact-active-class="active"
          title="Tournament Dashboard"
        >
          <b>Join Mars Madness</b>
        </b-nav-item>
        <!-- FIXME:  TEMP -->
        <b-nav-item
          class="mx-2 text-nowrap"
          link-classes="btn btn-warning text-white"
          :to="classroomLobby"
          exact-active-class="active"
          title="Classroom lobby"
        >
          <b>Classroom lobby</b>
        </b-nav-item>
        <!-- END TEMP -->
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item class="mx-2" target="_blank" :href="$settings.DISCORD_URL" title="Discord"
          ><b-icon-discord></b-icon-discord
        ></b-nav-item>
        <b-nav-item class="mx-2" target="_blank" :href="$settings.TWITTER_URL" title="Twitter"
          ><b-icon-twitter></b-icon-twitter
        ></b-nav-item>
        <b-nav-item class="mx-2" target="_blank" :href="$settings.INSTAGRAM_URL" title="Instagram"
          ><b-icon-instagram></b-icon-instagram
        ></b-nav-item>
        <div v-if="isAuthenticated">
          <b-nav-item-dropdown class="ml-3" :to="manual" right>
            <template #button-content>
              <b-icon-person-fill></b-icon-person-fill>
              {{ username }}
            </template>
            <b-dropdown-item :to="profile">Edit Profile</b-dropdown-item>
            <b-dropdown-item :to="history">Game History</b-dropdown-item>
            <b-dropdown-item @click="logout">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </div>
        <b-nav-form v-else class="ml-3">
          <b-button title="Sign In" variant="primary" :to="login">Sign In</b-button>
        </b-nav-form>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  ADMIN_PAGE,
  HOME_PAGE,
  ABOUT_PAGE,
  LOGIN_PAGE,
  CONSENT_PAGE,
  MANUAL_PAGE,
  GAME_PAGE,
  SOLO_GAME_PAGE,
  FREE_PLAY_LOBBY_PAGE,
  PLAYER_HISTORY_PAGE,
  LEADERBOARD_PAGE,
  PROFILE_PAGE,
  TOURNAMENT_DASHBOARD_PAGE,
  STUDENT_LOGIN_PAGE,
  EDUCATOR_LOGIN_PAGE,
  CLASSROOM_LOBBY_PAGE,
} from "@port-of-mars/shared/routes";

@Component({})
export default class Navbar extends Vue {
  portOfMarsLogoProps = {
    height: 60,
    width: 200,
  };
  readonly SITE_URL = "https://portofmars.asu.edu";

  admin = { name: ADMIN_PAGE };
  consent = { name: CONSENT_PAGE };
  home = { name: HOME_PAGE };
  about = { name: ABOUT_PAGE };
  login = { name: LOGIN_PAGE };
  manual = { name: MANUAL_PAGE };
  game = { name: GAME_PAGE };
  solo = { name: SOLO_GAME_PAGE };
  leaderboard = { name: LEADERBOARD_PAGE };
  history = { name: PLAYER_HISTORY_PAGE };
  tournamentDashboard = { name: TOURNAMENT_DASHBOARD_PAGE };
  freePlayLobby = { name: FREE_PLAY_LOBBY_PAGE };
  profile = { name: PROFILE_PAGE };
  studentLogin = { name: STUDENT_LOGIN_PAGE };
  educatorLogin = { name: EDUCATOR_LOGIN_PAGE };
  classroomLobby = { name: CLASSROOM_LOBBY_PAGE };

  get username() {
    return this.$tstore.state.user.username;
  }

  get isAuthenticated() {
    return this.$tstore.getters.isAuthenticated;
  }

  get isAdmin() {
    return this.$tstore.getters.isAdmin;
  }

  get isTournamentEnabled() {
    return this.$tstore.state.isTournamentEnabled;
  }

  get isFreePlayEnabled() {
    return this.$tstore.state.isFreePlayEnabled;
  }

  logout() {
    this.$ajax.forgetLoginCreds();
    this.$ajax.forgetSubmissionId();
    this.$router.push(this.home);
  }
}
</script>

<style lang="scss" scoped></style>
