import Vue from 'vue';
import VueSocketIOExt from 'vue-socket.io-extended';
// import io from 'socket.io-client';
import Vuex from 'vuex';
import App from './App.vue';
import router from './router';
import store from './store';

// const socket = io('http://localhost:3005');
// Vue.use(VueSocketIOExt, socket);

Vue.use(Vuex);

Vue.config.productionTip = false;

// register layouts globally at entry point of app
Vue.component('default-layout', DefaultLayout);
Vue.component('tutorial-layout', TutorialLayout);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
