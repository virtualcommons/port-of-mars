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
@import './stylesheets/bootstrap-customize';
@import '~bootstrap/scss/bootstrap';
@import '~bootstrap-vue/src/index';

/* IMPORT ANIMATE.CSS (BASE) */
@import '~animate.css/source/_base.css';

/* IMPORT SCSS */
@import './stylesheets/main.scss';
</style>
