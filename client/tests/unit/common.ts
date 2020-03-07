import {TStore, TypedStore} from "@/plugins/tstore";

import {
  createLocalVue as _createLocalVue,
  mount,
  shallowMount,
  ThisTypedMountOptions,
  VueClass
} from '@vue/test-utils';
import Vuex from 'vuex';
import getters from "@/store/getters";
import mutations from "@/store/mutationFolder";
import _ from "lodash";
import {initialStoreState} from "@/store/state";
import BootstrapVue from "bootstrap-vue";
import router from "@/router";
import {Ajax} from "@/plugins/ajax";
import {VueRouter} from "vue-router/types/router";

export function createLocalVue() {
  const localVue = _createLocalVue();
  localVue.use(BootstrapVue);
  localVue.use(Vuex);
  localVue.use(TypedStore);
  return localVue;
}

export function createStore() {
  const state = _.cloneDeep(initialStoreState);
  return new Vuex.Store({
    state,
    getters,
    mutations
  });
}

export function provideClient() {
  return {
    provide: {
      $client: {
        joinOrCreate: jest.fn().mockImplementation((roomName: string) => null)
      }
    }
  }
}

export function mockRoomSetup() {
  return {
    methods: {
      setupRoom() {}
    }
  }
}

export function mountPOM<V extends Vue>(component: VueClass<V>, options: ThisTypedMountOptions<V> = {}) {
  const localVue = createLocalVue();
  const store = createStore();
  localVue.use(Ajax, {router, store});
  return mount(component, {
    localVue,
    store,
    router,
    ...options,
  })
}

export function shallowMountPOM<V extends Vue>(component: VueClass<V>, options: ThisTypedMountOptions<V> = {}) {
  const localVue = createLocalVue();
  const store = createStore();
  localVue.use(Ajax, {router, store});
  return shallowMount(component, {
    localVue,
    store,
    router,
    ...options,
  })
}
