<template>
  <div id="app" class="game">
    <router-view :key="$route.path" />
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);

export default class App extends Vue {}
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
