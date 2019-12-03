import Vue from 'vue';
import VueSocketIOExt from 'vue-socket.io-extended';
// import io from 'socket.io-client';
import Vuex, {Store} from 'vuex';
import * as Colyseus from 'colyseus.js';
import { SendChatMessageData } from 'shared/requests';
import App from './App.vue';
import router from './router';
import store from './store';
import { RequestAPI } from './api/request';
import { applyServerResponses } from './api/response';
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

async function colyseusSetup() {
  const client = new Colyseus.Client('ws://localhost:2567');
  const gameRoom = await client.joinOrCreate('game');
  applyServerResponses(gameRoom, store);
  return new RequestAPI(gameRoom);
}

Vue.use(Vuex);

Object.defineProperty(Vue.prototype, '$tstore', {
  get: function(this: Vue & { $store: Store<any>}) {
    return this.$store;
  }
});

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
