<template>
  <div
    id="app"
    class="container p-0 border border-danger"
    style="height: 712.5px;"
  >
    <router-view :key="$route.path" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);

@Component({
  components: {},
})
export default class Home extends Vue {
  /**
   * Gets the value of the layout from the vuex store
   * @return the value of layout
   *
   */
  get layout() {
    return this.$tstore.getters.layout;
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
