<template>
  <b-navbar tag="header" toggleable="md" type="dark" variant="dark" class="w-100" fixed="top">
    <b-navbar-brand :to="home">
      <b-img
        id="logo"
        v-bind="portOfMarsLogoProps"
        :src="require('@port-of-mars/client/assets/images/logo-Port-of-Mars-White.svg')"
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
        >Admin</b-nav-item>
        <b-nav-item
          class="mx-2"
          :to="about"
          exact-active-class="active"
          title="About Port of Mars"
        >About</b-nav-item>
        <b-nav-item
          class="mx-2"
          :to="consent"
          exact-active-class="active"
          title="Consent Form"
        >Consent Form</b-nav-item>
        <b-nav-item
          class="mx-2"
          :to="manual"
          target="_blank"
          exact-active-class="active"
          title="Game Manual"
        >Manual</b-nav-item>
        <b-nav-item
          class="mx-2"
          :to="dashboard"
          exact-active-class="active"
          title="Player Dashboard"
        >Play</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item
          class="mx-2"
          target="_blank"
          :href="constants.DISCORD_URL"
          title="Discord"
        ><b-icon-discord></b-icon-discord></b-nav-item>
        <b-nav-item
          class="mx-2"
          target="_blank"
          :href="constants.TWITTER_URL"
          title="Twitter"
        ><b-icon-twitter></b-icon-twitter></b-nav-item>
        <b-nav-item
          class="mx-2"
          target="_blank"
          :href="constants.INSTAGRAM_URL"
          title="Instagram"
        ><b-icon-instagram></b-icon-instagram></b-nav-item>
        <div v-if="isAuthenticated">
          <b-nav-item-dropdown class="ml-3" :to="manual" right>
            <template #button-content>
              <b-icon-person-fill></b-icon-person-fill>
              {{ username }}
            </template>
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
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  ADMIN_PAGE,
  DASHBOARD_PAGE,
  HOME_PAGE,
  ABOUT_PAGE,
  LOGIN_PAGE,
  REGISTER_PAGE,
  MANUAL_PAGE,
  GAME_PAGE,
  LOBBY_PAGE,
} from "@port-of-mars/shared/routes";
import { isDevOrStaging, Constants } from "@port-of-mars/shared/settings";
import _ from "lodash";

@Component({})
export default class Header extends Vue {
  @Prop({ default: "Mission Control Dashboard" })
  title!: string;

  isDevMode: boolean = false;

  contactUrl: string = "mailto:portmars@asu.edu";

  portOfMarsLogoProps = {
    height: 60
  };
  readonly SITE_URL = "https://portofmars.asu.edu";

  admin = { name: ADMIN_PAGE };
  dashboard = { name: DASHBOARD_PAGE };
  consent = { name: REGISTER_PAGE };
  home = { name: HOME_PAGE };
  about = { name: ABOUT_PAGE };
  login = { name: LOGIN_PAGE };
  manual = { name: MANUAL_PAGE };
  game = { name: GAME_PAGE };
  lobby = { name: LOBBY_PAGE };

  async created() {
    this.isDevMode = isDevOrStaging();
  }

  mounted() {
    console.log("route name: ", this.$route.name);
    console.log("route.name = login", this.$route.name == this.login.name);
  }

  get constants() {
    return Constants;
  }

  get username() {
    console.log("store user: ", this.$tstore.state.user);
    return this.$tstore.state.user.username;
  }

  get isAuthenticated() {
    return this.$tstore.getters.isAuthenticated;
  }

  get isAdmin() {
    return this.$tstore.getters.isAdmin;
  }

  get isInGame() {
    if (_.isNil(this.$route.name)) {
      return false;
    } else {
      return this.game.name == this.$route.name || this.lobby.name == this.$route.name;
    }
  }

  logout() {
    this.$ajax.forgetLoginCreds();
    this.$ajax.forgetSubmissionId();
    this.$router.push(this.home);
  }
}
</script>

<style lang="scss" scoped>
#logo {
  width: 200px;
}
</style>
