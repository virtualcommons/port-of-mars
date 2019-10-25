import Vue from 'vue';
import VueSocketIOExt from 'vue-socket.io-extended';
// import io from 'socket.io-client';
import Vuex from 'vuex';
import App from './App.vue';
import router from './router';
import store from './store';

// imports: layouts
import Default from '@/layouts/DefaultLayout.vue';
import Tutorial from '@/layouts/TutorialLayout.vue';

import VueTour from 'vue-tour';

// const socket = io('http://localhost:3005');
// Vue.use(VueSocketIOExt, socket);

require('vue-tour/dist/vue-tour.css');

Vue.use(Vuex, VueTour);

// register layouts globally at entry point of app
Vue.component('default-layout', Default);
Vue.component('tutorial-layout', Tutorial);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
