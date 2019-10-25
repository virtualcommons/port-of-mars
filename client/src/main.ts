import Vue from 'vue';
import VueSocketIOExt from 'vue-socket.io-extended';
// import io from 'socket.io-client';
import Vuex from 'vuex';
import VueTour from 'vue-tour';
import App from './App.vue';
import router from './router';
import store from './store';

// const socket = io('http://localhost:3005');
// Vue.use(VueSocketIOExt, socket);

require('vue-tour/dist/vue-tour.css');

Vue.use(Vuex, VueTour);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
