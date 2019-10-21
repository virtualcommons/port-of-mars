import Vue from 'vue';
//import VueSocketIOExt from 'vue-socket.io-extended';
//import io from 'socket.io-client';
import App from './App.vue';
import Vuex from "vuex";
import router from './router';
import store from './store';

//const socket = io('http://localhost:3005');

Vue.config.productionTip = false;

//Vue.use(VueSocketIOExt, socket);

Vue.use(Vuex)

new Vue({
  router,
  // store,
  render: h => h(App),
}).$mount('#app');
