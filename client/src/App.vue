<template>
  <div id="app" class="game">
    <router-view :key="$route.path" />
    <Footer v-if="showFooter($route.path)"/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Footer from "@port-of-mars/client/components/global/Footer.vue";
import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);

@Component({
  components: {
    Footer,
  }
})
export default class App extends Vue {
  /**
   * Show footer if layout !== /game or /tutorial.
   * @param path
   */
  showFooter(path: string): boolean {
    return !(path === `/game` || path === `/tutorial` || path === `/dashboard`);
  }

}
</script>

<style lang="scss">
/* IMPORT BOOTSTRAP */
@import './stylesheets/bootstrap-customize';
@import '~bootstrap/scss/bootstrap';
@import '~bootstrap-vue/src/index';

/* IMPORT ANIMATE.CSS (BASE) */
@import '~animate.css/source/_base.css';

/* IMPORT SCSS */
@import './stylesheets/main.scss';

</style>
