<template>
  <b-container class="h-100 p-0 m-0 bg" fluid>
    <b-row no-gutters class="h-100 w-100">
      <!-- <Header v-if="!isGamePage"></Header> -->
      <Navbar v-if="!isGamePage"></Navbar>
      <router-view
        :class="!isManual ? 'h-100 d-flex flex-grow-1 ' : 'h-auto'"
        :key="$route.path"
      ></router-view>
    </b-row>
    <!-- FIXME: figure out how to add footer to dashboard without weird page behaior
          ideally, we should just be able to import the Footer once into App.vue
    -->
    <Footer v-if="isDashboard"></Footer>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BootstrapVue from "bootstrap-vue";
import Navbar from "@port-of-mars/client/components/global/Navbar.vue";
import Header from "@port-of-mars/client/components/global/Header.vue";
import Footer from "@port-of-mars/client/components/global/Footer.vue";
import { GAME_PAGE, MANUAL_PAGE, DASHBOARD_PAGE, LOBBY_PAGE } from "@port-of-mars/shared/routes";
import _ from "lodash";
Vue.use(BootstrapVue);

@Component({
  components: {
    Navbar,
    Header,
    Footer
  }
})
export default class App extends Vue {
  dashboard = { name: DASHBOARD_PAGE };
  game = { name: GAME_PAGE };
  manual = { name: MANUAL_PAGE };
  lobby = { name: LOBBY_PAGE };

  get isGamePage() {
    if (_.isNil(this.$route.name)) {
      return false;
    } else {
      return this.lobby.name == this.$route.name || this.game.name == this.$route.name;
    }
  }

  get isManual() {
    if (_.isNil(this.$route.name)) {
      return false;
    } else {
      return this.manual.name == this.$route.name;
    }
  }

  get isDashboard() {
    if (_.isNil(this.$route.name)) {
      return false;
    } else {
      return this.dashboard.name == this.$route.name;
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

.bg {
  background-color: var(--dark-shade);
  background-size: cover;
}
</style>
