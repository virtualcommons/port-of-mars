import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import * as Colyseus from 'colyseus.js';
import App from './App.vue';
import router from './router';
import store from './store';
import {TypedStore} from "@/plugins/tstore";
import {Ajax} from "@/plugins/ajax";

Vue.use(Vuex);
Vue.use(TypedStore);
Vue.use(Ajax);

Vue.config.productionTip = false;

const $client = new Colyseus.Client(process.env.SERVER_URL_WS);

new Vue({
  router,
  store,
  render: h => h(App),
  provide() {
    return { $client }
  }
}).$mount('#app');
