import {TypedStore} from "@/plugins/tstore";

import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex, {Store} from 'vuex';
import _ from 'lodash';
import App from '@/App.vue';
import router from '@/router';
import {initialStoreState, State} from "@/store/state";
import getters from "@/store/getters";
import mutations from "@/store/mutationFolder";

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(TypedStore);

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
    const wrapper = shallowMount(App, { localVue, store, router });
    expect(wrapper.attributes('class')).toBe('game');
  });
});
