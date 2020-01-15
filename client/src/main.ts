import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import * as Colyseus from 'colyseus.js';
import App from './App.vue';
import router from './router';
import store from './store';

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

Vue.use(Vuex);

Object.defineProperty(Vue.prototype, '$tstore', {
  get: function(this: Vue & { $store: Store<any> }) {
    return this.$store;
  }
});

Vue.config.productionTip = false;

const $client = new Colyseus.Client(process.env.SERVER_URL);

new Vue({
  router,
  store,
  render: h => h(App),
  provide() {
    return { $client }
  }
}).$mount('#app');
