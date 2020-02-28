<template>
  <div id="app" class="game">
    <router-view :key="$route.path" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { EnvironmentMode } from './settings';
import Game from '@/views/Game.vue';
import Tutorial from '@/views/Tutorial.vue';
import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);

@Component({
  components: {
    Game,
    Tutorial
  }
})
export default class Home extends Vue {
  env: EnvironmentMode = new EnvironmentMode;

  /**
   * Gets the value of the layout from the vuex store
   * @return the value of layout
   *
   */

  get layout() {
    return this.$tstore.getters.layout;
  }

  /**
   * Gets the string value of the current environment.
   * @return The environment.
   * 
   */
  get mode() {
    return this.env.environment;
  }
}
</script>

<style lang="scss">
/* IMPORT BOOTSTRAP */
@import '~bootstrap/dist/css/bootstrap.min.css';
@import '~bootstrap-vue/dist/bootstrap-vue.min.css';

/* IMPORT ANIMATE.CSS (BASE) */
@import '~animate.css/source/_base.css';

/* IMPORT SCSS */
@import './stylesheets/main.scss';
</style>
