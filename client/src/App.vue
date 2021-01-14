<template>
  <div class="game">
    <b-alert v-if="isDevModeEnabled && !isGameOrTutorial" class="text-center m-0" show variant="warning">
      <b-icon-exclamation-triangle-fill class="mx-3" scale="1.5" variant="warning"></b-icon-exclamation-triangle-fill>
      You are currently accessing a development version of the Port of Mars only used for testing.
    </b-alert>
    <b-container class="h-100 p-0 m-0" fluid>
      <router-view :key="$route.path" class="bg-login"></router-view>
    </b-container>
    <Footer v-if="!isGameOrTutorial" />
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {isDev, isStaging} from "@port-of-mars/shared/settings";
import Footer from "@port-of-mars/client/components/global/Footer.vue";
import BootstrapVue from "bootstrap-vue";
import {GAME_PAGE, LOGIN_PAGE, TUTORIAL_PAGE} from "@port-of-mars/shared/routes";

Vue.use(BootstrapVue);

@Component({
  components: {
    Footer
  }
})
export default class App extends Vue {
  get isDevModeEnabled() {
    return isDev() || isStaging();
  }

  get isGameOrTutorial() {
    return this.$route.name == GAME_PAGE || this.$route.name == TUTORIAL_PAGE
  }

  isLogin(routeName: string) {
    return routeName == LOGIN_PAGE;
  }
}
</script>

<style lang="scss">
/* IMPORT BOOTSTRAP */
@import "./stylesheets/bootstrap-customize";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";

/* IMPORT ANIMATE.CSS (BASE) */
@import "~animate.css/source/_base.css";

/* IMPORT SCSS */
@import "./stylesheets/main.scss";

.bg-login {
  background-image: url("assets/background/space_open_erased.fw.png");
  background-position: top;
  background-repeat: no-repeat;
  background-size: cover;
}

.bg-generic {
  background-image: url("assets/background/space_open.png");
  background-position: bottom;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
