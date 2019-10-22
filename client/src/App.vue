<template>
  <div class="game">
    <component :is="layout">
      <router-view />
    </component>

  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

/* bootstrap imports */
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import './custom.scss';

import { Socket } from 'vue-socket.io-extended';

Vue.use(BootstrapVue);

export default class Home extends Vue {
  private defaultLayout: string = 'default';

  get layout() {
    return `${this.$route.meta.layout || this.defaultLayout}-layout`;
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
<style >
  html, body{
    font-family: 'Space Mono', monospace !important;
  }

  .game {
    height: 100vh;
    width: 100vw;
  }
</style>
