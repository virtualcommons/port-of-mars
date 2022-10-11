<template>
  <b-navbar tag="header" toggleable="md" type="dark" variant="dark" class="w-100" sticky>
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
      <b-navbar-nav class="ml-auto">

        <b-nav-item
          :to="openlobby"
          exact-active-class="active"
          title="Play Port of Mars"
        >Play</b-nav-item>
        <b-nav-item
          :to="onboarding"
          exact-active-class="active"
          title="Tutorial"
        >Tutorial</b-nav-item>
        <b-nav-item
          :to="home"
          exact-active-class="active"
          title="About"
        >About</b-nav-item>
        <b-nav-item
          href="https://instagram.com/portofmars/"
          target="_blank"
          exact-active-class="active"
          title="News"
        >News</b-nav-item>

        <!-- Icons -->
        <!-- <b-nav-item href="https://email.com/">
          <b-icon icon="envelope"></b-icon>
        </b-nav-item>
        <b-nav-item href="https://instagram.com/">
          <b-icon icon="instagram"></b-icon>
        </b-nav-item>
        <b-nav-item href="https://twitter.com/">
          <b-icon icon="twitter"></b-icon>
        </b-nav-item> -->
        <div v-if="isAuthenticated">
          <b-nav-item-dropdown :to="manual" right>
            <template #button-content>
              <b-icon icon="person-fill"></b-icon>
              {{ username }}
            </template>
            <b-dropdown-item @click="logout">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </div>
        <b-nav-form v-else class="ml-3">
          <b-button title="Sign In" variant="primary" :to="openlogin">Sign In</b-button>
        </b-nav-form>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  DASHBOARD_PAGE,
  HOME_PAGE,
  LOGIN_PAGE,
  REGISTER_PAGE,
  MANUAL_PAGE,
  GAME_PAGE,
  LOBBY_PAGE,
  OPENLOGIN_PAGE,
  OPENLOBBY_PAGE,
  ONBOARDING_PAGE
} from "@port-of-mars/shared/routes";
import { isDevOrStaging } from "@port-of-mars/shared/settings";
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

  dashboard = { name: DASHBOARD_PAGE };
  consent = { name: REGISTER_PAGE };
  home = { name: HOME_PAGE };
  login = { name: LOGIN_PAGE };
  manual = { name: MANUAL_PAGE };
  game = { name: GAME_PAGE };
  lobby = { name: LOBBY_PAGE };
  openlogin = { name: OPENLOGIN_PAGE };
  openlobby = { name: OPENLOBBY_PAGE };
  onboarding = { name: ONBOARDING_PAGE };

  async created() {
    this.isDevMode = isDevOrStaging();
  }

  mounted() {
    console.log("route name: ", this.$route.name);
    console.log("route.name = login", this.$route.name == this.login.name);
  }

  get username() {
    console.log("store user: ", this.$tstore.state.user);
    return this.$tstore.state.user.username;
  }

  get isAuthenticated() {
    return this.$tstore.getters.isAuthenticated;
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

<style scoped>

#header {
  display: grid;
  grid-template-columns: 200px 25px 1fr;
  width: 100%;
  position: fixed;
  z-index: 10;
  padding: 1rem;
  box-shadow: 2px 2px 10px #000000;
}

#logo {
  width: 200px;
}

#dev-alert {
  position: fixed;
  top: 0;
  margin: 100px 0 0 5px;
  z-index: 9999;
}
</style>
