import Vue from 'vue';
import VueSocketIOExt from 'vue-socket.io-extended';
// import io from 'socket.io-client';
import Vuex, {Store} from 'vuex';
import * as Colyseus from 'colyseus.js';
import { SendChatMessageData } from 'shared/requests';
import App from './App.vue';
import router from './router';
import store from './store';

import { GameRequestAPI } from './api/gameAPI/request';
import { gameApplyServerResponses } from './api/gameAPI/response';

import { WaitingRequestAPI } from './api/waitingLobbyAPI/request';
import { waitingApplyServerResponses } from './api/waitingLobbyAPI/response';

import {State} from "@/store/state";
import Getters from "@/store/getters";
import Mutations from "@/store/mutationFolder";

declare module 'vue/types/vue' {
  interface TStore {
    state: State
    readonly getters: { [K in keyof typeof Getters]: ReturnType<typeof Getters[K]> }

    commit<K extends keyof typeof Mutations>(name: K, payload: Parameters<typeof Mutations[K]>[1]): void
  }

  interface Vue {
    $tstore: TStore
  }
}

export function setupManager(type:string){
  if(type=='start'){
    colyseusSetupWait().then(($api) => {
      new Vue({
        router,
        store,
        provide() {
          return { $api };
        },
        render: h => h(App),
      }).$mount('#app');
    });
  }

  if(type=='game'){
    colyseusSetupGame().then(($api) => {
      new Vue({
        router,
        store,
        provide() {
          return { $api };
        },
        render: h => h(App),
      }).$mount('#app');
    });
  }
}

async function colyseusSetupWait() {
  const client = new Colyseus.Client('ws://localhost:2567');
  const waitingRoom = await client.joinOrCreate('waiting');
  waitingApplyServerResponses(waitingRoom, store);
  return new WaitingRequestAPI(waitingRoom);
}

async function colyseusSetupGame() {
  const client = new Colyseus.Client('ws://localhost:2567');
  const gameRoom = await client.joinOrCreate('game');
  gameApplyServerResponses(gameRoom, store);
  return new GameRequestAPI(gameRoom);
}

Vue.use(Vuex);

Object.defineProperty(Vue.prototype, '$tstore', {
  get: function(this: Vue & { $store: Store<any>}) {
    return this.$store;
  }
});

Vue.config.productionTip = false;

setupManager('start');
// colyseusSetup().then(($api) => {
//   new Vue({
//     router,
//     store,
//     provide() {
//       return { $api };
//     },
//     render: h => h(App),
//   }).$mount('#app');
// });
