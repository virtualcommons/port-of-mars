import Vue from 'vue';
import VueSocketIOExt from 'vue-socket.io-extended';
// import io from 'socket.io-client';
import Vuex, { Store } from 'vuex';
import * as Colyseus from 'colyseus.js';
import { SendChatMessageData } from 'shared/requests';
import App from './App.vue';
import router from './router';
import store from './store';

import { GameRequestAPI } from './api/game/request';
import { applyGameServerResponses } from './api/game/response';

import { WaitingRequestAPI } from './api/waitingLobby/request';
import { applyWaitingServerResponses } from './api/waitingLobby/response';

import { QuizRequestAPI } from './api/quiz/request';
import { applyQuizServerResponses } from './api/quiz/response';

import { State } from '@/store/state';
import Getters from '@/store/getters';
import Mutations from '@/store/mutationFolder';

declare module 'vue/types/vue' {
  interface TStore {
    state: State;
    readonly getters: { [K in keyof typeof Getters]: ReturnType<typeof Getters[K]> };

    commit<K extends keyof typeof Mutations>(
      name: K,
      payload: Parameters<typeof Mutations[K]>[1]
    ): void;
  }

  interface Vue {
    $tstore: TStore;
  }
}

export function clientRunner(type: string) {
  setupManager(type).then($api => {
    new Vue({
      router,
      store,
      provide() {
        return { $api };
      },
      render: h => h(App)
    }).$mount('#app');
  });
}

async function setupManager(type: string) {
  const client = new Colyseus.Client('ws://localhost:2567');
  if (type == 'start') {
    const waitingRoom = await client.joinOrCreate('waiting');
    applyWaitingServerResponses(waitingRoom, store);
    return new WaitingRequestAPI(waitingRoom);
  }

  if (type == 'game') {
    const gameRoom = await client.joinOrCreate('game');
    applyGameServerResponses(gameRoom, store);
    return new GameRequestAPI(gameRoom);
  }

  if (type == 'quiz') {
    const quizRoom = await client.joinOrCreate('quiz');
    applyQuizServerResponses(quizRoom, store);
    return new QuizRequestAPI(quizRoom);
  }
}

Vue.use(Vuex);

Object.defineProperty(Vue.prototype, '$tstore', {
  get: function(this: Vue & { $store: Store<any> }) {
    return this.$store;
  }
});

Vue.config.productionTip = false;

clientRunner('start');

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
