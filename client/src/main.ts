import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import * as Colyseus from 'colyseus.js';
import Vue from 'vue';
import VueMeta from 'vue-meta';
import Vuex from 'vuex';
import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';
import { Integrations } from "@sentry/tracing";

import { isStagingOrProduction, SENTRY_DSN } from '@port-of-mars/shared/settings';

import { Ajax } from "@port-of-mars/client/plugins/ajax";
import { TypedStore } from "@port-of-mars/client/plugins/tstore";
import { SfxManager } from '@port-of-mars/client/util';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(Vuex);
Vue.use(TypedStore);
Vue.use(Ajax, { router, store });
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueMeta);

Vue.config.productionTip = false;

if (isStagingOrProduction()) {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [
      new VueIntegration({ Vue, tracing: true }),
      new Integrations.BrowserTracing(),
    ],
    tracesSampleRate: 1,
  });
}

const $client = new Colyseus.Client(process.env.SERVER_URL_WS || undefined);
const $sfx = new SfxManager();

new Vue({
  router,
  store,
  render: h => h(App),
  provide() {
    return { $client, $sfx }
  }
}).$mount('#app');
