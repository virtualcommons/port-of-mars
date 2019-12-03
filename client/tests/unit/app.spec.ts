import Vue from "vue";

declare module 'vue/types/vue' {
  interface TStore {
    state: State
    readonly getters: { [K in keyof typeof getters]: ReturnType<typeof getters[K]> }

    commit<K extends keyof typeof mutations>(name: K, payload: Parameters<typeof mutations[K]>[1]): void
  }

  interface Vue {
    $tstore: TStore
  }
}

import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex, {Store} from 'vuex';
import _ from 'lodash';
import App from '@/App.vue';
import {initialStoreState, State} from "@/store/state";
import getters from "@/store/getters";
import mutations from "@/store/mutationFolder";

const localVue = createLocalVue();

function pathTStore(vuePrototype: any) {
  Object.defineProperty(vuePrototype.prototype, '$tstore', {
    get: function(this: Vue & { $store: Store<any>}) {
      return this.$store;
    }
  });
}
localVue.use(Vuex);
pathTStore(localVue);

describe('App.vue', () => {
  let store: any;
  let state: any;

  beforeEach(() => {
    state = _.cloneDeep(initialStoreState);

    store = new Vuex.Store({
      state,
      getters,
      mutations
    });
  });

  it('renders', () => {
    const wrapper = shallowMount(App, { localVue, store });
    expect(wrapper.attributes('class')).toBe('game');
  });
});
