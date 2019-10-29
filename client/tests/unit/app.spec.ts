import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import _ from 'lodash';
import App from '@/App.vue';
import { initialStoreState } from '@/store';

const localVue = createLocalVue();

describe('App.vue', () => {
  let store: any;
  let state: any;

  beforeEach(() => {
    state = _.cloneDeep(initialStoreState);

    store = new Vuex.Store({
      state,
    });
  });

  it('renders', () => {
    const wrapper = shallowMount(App, { localVue, store });
    expect(wrapper.attributes('class')).toBe('game');
  });
});
