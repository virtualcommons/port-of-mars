<template>
  <b-navbar toggleable="lg" type="dark" variant="dark" class="w-100" fixed>
    <b-navbar-brand :to="home">
      <b-img
        id="logo"
        v-bind="portOfMarsLogoProps"
        :src="require('@port-of-mars/client/assets/images/logo-Port-of-Mars-White.svg')"
        alt="the planet mars illustrated in white above Port of Mars"
      >
      </b-img>
    </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <!--
        <b-nav-item class="nav-link"><a href="#about" title="about">About</a></b-nav-item>
        <b-nav-item class="nav-link"><a href="#leaderboard" title="leaderboard">Leaderboard</a></b-nav-item>
        <b-nav-item class="nav-link"><a href="sign-up" title="sign-up">Sign Up</a></b-nav-item>
        -->
        <b-nav-item class="nav-link"
          ><a href="https://www.instagram.com/portofmars/" title="news">News</a></b-nav-item
        >
        <b-nav-item class="nav-link" :to="manual" target="_blank" title="gameplay"
          >Gameplay</b-nav-item
        >
        <template v-if="isAuthenticated">
          <b-nav-item class="nav-link" :to="consent">Consent Form</b-nav-item>
          <b-nav-item class="nav-link" v-if="isAuthenticated" @click="logout">Logout</b-nav-item>
        </template>
        <template v-else>
          <b-nav-item class="nav-link" v-if="!isAuthenticated" :to="login" title="Sign in"
            >Sign In</b-nav-item
          >
        </template>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  DASHBOARD_PAGE,
  HOME_PAGE,
  LOGIN_PAGE,
  REGISTER_PAGE,
  MANUAL_PAGE
} from "@port-of-mars/shared/routes";

@Component({})
export default class Header extends Vue {
  @Prop({ default: "Mission Control Dashboard" })
  title;

  contactUrl = "mailto:portmars@asu.edu";

  portOfMarsLogoProps = {
    height: 60
  };

  dashboard = { name: DASHBOARD_PAGE };
  consent = { name: REGISTER_PAGE };
  home = { name: HOME_PAGE };
  login = { name: LOGIN_PAGE };
  manual = { name: MANUAL_PAGE };

  mounted() {
  }

  get isAuthenticated() {
    return this.$tstore.getters.isAuthenticated;
  }

  get isHomeOrLogin() {
    return [this.login.name, this.home.name].includes(this.$route.name);
  }

  logout() {
    this.$ajax.forgetLoginCreds();
    this.$router.push(this.home);
  }
}
</script>

<style scoped>
.nav-link {
  font-size: 1.25rem;
  text-align: end;
}
</style>
