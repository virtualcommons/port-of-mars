import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import * as Colyseus from 'colyseus.js';
import App from './App.vue';
import router from './router';
import store from './store';
import {TypedStore} from "@/plugins/tstore";

Vue.use(Vuex);
Vue.use(TypedStore);

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
