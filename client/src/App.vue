<template>
  <b-container class="h-100 p-0 m-0 bg" fluid>
    <b-row no-gutters class="h-100 w-100">
      <router-view class="m-0 p-0" :key="$route.path"></router-view>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Footer from "@port-of-mars/client/components/global/Footer.vue";
import BootstrapVue from "bootstrap-vue";

Vue.use(BootstrapVue);

@Component({
  components: {
    Footer
  }
})
export default class App extends Vue {}
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

.bg {
  background-image: url("assets/background/landing_2021.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
