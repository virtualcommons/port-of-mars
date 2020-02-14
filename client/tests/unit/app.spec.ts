import {createLocalVue, shallowMountPOM} from "./common";
import App from '@/App.vue';

describe('App.vue', () => {
  it('renders', () => {
    const wrapper = shallowMountPOM(App);
    expect(wrapper.attributes('class')).toBe('game');
  });
});
