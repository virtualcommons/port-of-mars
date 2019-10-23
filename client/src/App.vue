<template>
  <div class="game">
    <component :is="layout">
      <v-tour name="gameTour" :steps="steps"></v-tour>
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

import VueTour from 'vue-tour';
import { Socket } from 'vue-socket.io-extended';

require('vue-tour/dist/vue-tour.css');
Vue.use(BootstrapVue, VueTour);

// @Component ({
//   components: {
//     VueTour,
//   }
// })

export default class Home extends Vue {
  name: 'gameTour';

  private defaultLayout: string = 'default';
  public steps = [
    {
      target: '#v-step-0',  // We're using document.querySelector() under the hood
      content: `Discover <strong>Vue Tour</strong>!`
    }
  ]

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

  mounted() {
    this.$tours['gameTour'].start()
  }
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
