<script setup lang="ts">
import { ref } from "vue";
import {
  DASHBOARD_PAGE,
  HOME_PAGE,
  LOGIN_PAGE,
  REGISTER_PAGE,
  MANUAL_PAGE,
  GAME_PAGE,
  LOBBY_PAGE,
} from "@port-of-mars/shared/routes";
import { isDevOrStaging } from "@port-of-mars/shared/settings";
import BootstrapVue from "bootstrap-vue";

const title = ref("Mission Control Dashboard");

const isDevMode: boolean = isDevOrStaging;
const contactUrl = "mailto:portmars@asu.edu";
const SITE_URL = "https://portofmars.asu.edu";
const INSTAGRAM_URL = "https://www.instagram.com/portofmars/";

const dashboard = { name: DASHBOARD_PAGE };
const consent = { name: REGISTER_PAGE };
const home = { name: HOME_PAGE };
const login = { name: LOGIN_PAGE };
const manual = { name: MANUAL_PAGE };
const game = { name: GAME_PAGE };
const lobby = { name: LOBBY_PAGE };
</script>

<template>
  <header>
    <img
      id="logo"
      src="assets/images/logo-Port-of-Mars-White.svg"
      alt="the planet mars illustrated in white above Port of Mars"
    />
    <h1 class="hidden">Port of Mars</h1>
    <nav>
      <h2 class="hidden">Main Navigation</h2>
      <div id="nav-mobile">
        <input type="checkbox" />
        <span></span>
        <span></span>
        <span></span>
        <ul id="nav">
          <li><a href="#about" title="about">About</a></li>
          <li><a href="#winners" title="winners">Winners</a></li>
          <li><a href="#news" title="news">News</a></li>
          <li><a href="#gameplay" title="gameplay">Gameplay</a></li>
          <li><a href="sign-up" title="sign-up">Sign Up</a></li>
          <li><a :to="login" title="log-in">Log In</a></li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<style lang="css">
@import url("../assets/css/main.css");
</style>
