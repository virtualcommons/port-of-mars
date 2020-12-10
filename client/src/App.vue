<template>
   <div class="game">
  <b-container class="p-0 m-0" fluid>
    <b-alert show v-if="isDevModeEnabled" variant="warning" class="text-center">
      <b-icon icon="exclamation-triangle-fill" scale="1.5" variant="warning" class="mx-3"></b-icon>
      You are currently accessing a development version of the Port of Mars only used for testing.
    </b-alert>
    <router-view :key="$route.path"></router-view>
<!--    <Footer />-->
  </b-container>
   </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { isDev, isStaging } from "@port-of-mars/shared/settings";
import Footer from "@port-of-mars/client/components/global/Footer.vue";
import BootstrapVue from "bootstrap-vue";

Vue.use(BootstrapVue);

@Component({
  components: {
    Footer
  }
})
export default class App extends Vue {
  mounted() {
    this.detectBrowser();
  }

  get isDevModeEnabled() {
    return isDev() || isStaging();
  }

  /**
   * Show footer if layout !== /game or /tutorial.
   * @param path
   */
  showFooter(path: string): boolean {
    return !(path === `/game` || path === `/tutorial`);
  }

  detectBrowser() {
    // check for internet explorer or safari
    if (
      // check if browser is Internet Explorer
      window.navigator.userAgent.indexOf("MSIE ") > -1 ||
      !!navigator.userAgent.match(/Trident.*rv\:11\./) ||
      // check if browser is Safari
      (window.navigator.userAgent.indexOf("Safari") > -1 &&
        window.navigator.userAgent.indexOf("Chrome") == -1)
    ) {
      alert("Please use the latest version of Chrome or Firefox.");
    } else {
      console.log("valid browser");
    }
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
</style>
