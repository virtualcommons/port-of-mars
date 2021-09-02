import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import * as Colyseus from 'colyseus.js';
import Vue from 'vue';
import Vuex from 'vuex';
import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';
import { Integrations } from "@sentry/tracing";

import { Ajax } from "@port-of-mars/client/plugins/ajax";
import { TypedStore } from "@port-of-mars/client/plugins/tstore";
import { isStagingOrProduction, SENTRY_DSN } from '@port-of-mars/shared/settings';
import App from './App.vue';
import router from './router';
import store from './store';
import {State} from "@port-of-mars/shared/game/client/state";
import {Howl} from "howler";

Vue.use(Vuex);
Vue.use(TypedStore);
Vue.use(Ajax, { router, store });
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.config.productionTip = false;

console.log({Howl});
const chat_sound_notification = new Howl({ src: [require('./assets/sfx/notification/chat.mp3')] });
console.log({chat_sound_notification});

store.subscribe((mutation, state: State) => {
  switch (mutation.type) {
    case 'ADD_TO_CHAT': {
      console.log('playing chat notification sound');
      chat_sound_notification.play();
      break;
    }
  }
});

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

new Vue({
  router,
  store,
  render: h => h(App),
  provide() {
    return { $client }
  }
}).$mount('#app');
