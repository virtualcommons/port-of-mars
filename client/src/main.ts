import Vue from 'vue';
import VueSocketIOExt from 'vue-socket.io-extended';
// import io from 'socket.io-client';
import Vuex from 'vuex';
import * as Colyseus from 'colyseus.js';
import { SendChatMessageData } from 'shared/requests';
import App from './App.vue';
import router from './router';
import store from './store';
import { RequestAPI } from './api/request';
import { applyServerResponses } from './api/response';

async function colyseusSetup() {
  const client = new Colyseus.Client('ws://localhost:2567');
  const gameRoom = await client.joinOrCreate('game');
  applyServerResponses(gameRoom, store);
  return new RequestAPI(gameRoom);
}

Vue.use(Vuex);

Vue.config.productionTip = false;

colyseusSetup().then(($api) => {
  new Vue({
    router,
    store,
    provide() {
      return { $api };
    },
    render: h => h(App),
  }).$mount('#app');
});
