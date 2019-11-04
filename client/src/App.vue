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
    TutorialLayout,
  },
})
export default class Home extends Vue {
  private defaultLayout: string = 'default';

  /**
   * getLayout() computed property
   * Gets the value of the layout from the vuex store
   * @return the value of layout
   *
   */
  get layout() {
    // console.log(this.$store.getters.layout); // eslint-disable-line no-use-before-define
    return this.$store.getters.layout;
  }

  // @Socket('joinGame')
  // onJoinGame(data: unknown) {
  //   console.log(data);
  // }
  //
  // mounted() {
  //   console.log((this as any).$socket);
  //   (this as any).$socket.client.emit('joinGame', { my: 'data' });
  // }
}
</script>
<style>
html,
body {
  font-family: 'Space Mono', monospace !important;
  background-color: #1e2223;
  overflow: hidden;
}

.game {
  height: 100vh;
  width: 100vw;
}

p, img, button {
  /* prevent user from highlighting text */
  -webkit-touch-callout: none !important; /* iOS Safari */
  -webkit-user-select: none !important; /* Safari */
  -khtml-user-select: none !important; /* Konqueror HTML */
  -moz-user-select: none !important; /* Old versions of Firefox */
  -ms-user-select: none !important; /* Internet Explorer/Edge */
  user-select: none !important; /* Non-prefixed version, currently
                                     supported by Chrome, Opera and Firefox */
}
</style>
