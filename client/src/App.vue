<template>
    <b-container class="h-100 w-auto p-0 m-0" fluid>
      <b-alert v-if="isDevModeEnabled && !isGameOrTutorial" class="text-center m-0 p-0" show dismissible variant="warning">
        <p class="mt-2"><b-icon class="mx-2" icon="exclamation-triangle-fill" variant="danger"></b-icon> You are currently accessing a development version of the Port of Mars only used for testing. Go to <a href='https://portofmars.asu.edu'>portofmars.asu.edu</a> for the real deal.</p>
      </b-alert>
      <router-view :key="$route.path" class="bg-login"></router-view>
<!--      <Footer v-if="!isGameOrTutorial" />-->
    </b-container>
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
  background-image: url("assets/background/landing.png");
  background-position: top;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
