<template>
  <div class="game">
    <router-link to="/"></router-link>
    <router-view />
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

/* component imports : screens */
import LoginScreen from '@/components/LoginScreen.vue';

Vue.use(BootstrapVue);

@Component({
  components: {
    LoginScreen,
  },
})

export default class Home extends Vue {
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
