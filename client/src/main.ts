import Vue from 'vue';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
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

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new Integrations.Vue({Vue, attachProps: true})],
});

const $client = new Colyseus.Client(process.env.SERVER_URL_WS);

new Vue({
  router,
  store,
  render: h => h(App),
  provide() {
    return { $client }
  }
}).$mount('#app');
