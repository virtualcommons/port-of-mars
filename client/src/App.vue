<template>
  <div class="game">
    <component :is="layout" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

// imports: bootstrap
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import './custom.scss';

import { Socket } from 'vue-socket.io-extended';

// imports: layouts
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import TutorialLayout from '@/layouts/TutorialLayout.vue';

Vue.use(BootstrapVue);

@Component({
  components: {
    DefaultLayout,
    TutorialLayout
  }
})
export default class Home extends Vue {
  /**
   * getLayout() computed property
   * Gets the value of the layout from the vuex store
   * @return the value of layout
   *
   */

  get layout() {
    return this.$store.getters.layout;
  }

  // @Socket('joinGame')
  // onJoinGame(data: unknown) {
  //   console.log(data);
  // }

  // mounted() {
  //   console.log((this as any).$socket);
  //   (this as any).$socket.client.emit('joinGame', { my: 'data' });
  // }
}
</script>

<style>
/* DECLARE CSS VARIABLES */
body {
  --max-screen-height: 62.5625rem;
  --max-screen-width: 120rem;
  --min-screen-height: 48rem;
  --min-screen-width: 64rem;

  --space-gray: #1e2223;
  --space-orange: #c67b5c;
  --space-white: #f5f5f5;
  --space-white-opaque-1: rgba(245, 245, 245, 0.05);
  --space-white-opaque-2: rgba(245, 245, 245, 0.25);

  --color-Researcher: rgba(67, 124, 174, 0.2);
  --color-Pioneer: rgba(111, 36, 134, 0.2);
  --color-Curator: rgba(103, 65, 29, 0.2);
  --color-Entrepreneur: rgba(199, 168, 40, 0.2);
  --color-Politician: rgba(170, 42, 41, 0.2);
  --color-Upkeep: rgba(45, 143, 68, 0.2);

  --status-green: rgba(45, 143, 68, 1);
  --status-yellow: rgba(199, 168, 40, 1);
  --status-red: rgba(170, 42, 41, 1);

  --marslog-red: rgba(170, 42, 41, 0.05);
  --marslog-purple: rgba(111, 36, 134, 0.05);

  --font-family-default: 'Space Mono', monospace;
  --font-small: 0.75rem;
  --font-med: 1rem;
  --font-large: 1.5rem;

  --border-white: 0.125rem solid var(--space-white);
}

html,
body {
  font-family: var(--font-family-default) !important;
  background-color: var(--space-gray);
  overflow: hidden;
}

p,
h1,
img,
button {
  /* prevent user from highlighting p, img, button */
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  -khtml-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;
}

.game {
  height: 100vh !important;
  width: 100vw !important;
}

/* HANDLE ZOOM */

@media (max-width: 1280px) {
  html {
    font-size: 12px !important;
  }
}

@media (max-width: 960px) {
  html {
    font-size: 8px !important;
  }
}

@media (max-width: 640px) {
  html {
    font-size: 6px !important;
  }
}

@media (max-width: 480px) {
  html {
    font-size: 4px !important;
  }
}
</style>
