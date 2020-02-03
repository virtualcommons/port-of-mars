import Tutorial from "@/views/Tutorial.vue";
import App from "@/App.vue"
import {mockRoomSetup, mountPOM, provideClient} from "./common";
import {Step} from "@/types/tutorial";
import { TutorialAPI } from '@/api/tutorial/request';
import Vue from "vue";

describe('Tutorial.vue', () => {
  const wrapper = mountPOM(Tutorial, {...mockRoomSetup(), ...provideClient()});
  const steps: Array<Step> = wrapper.vm.$data.steps;

  const store = wrapper.vm.$store;

  const api = new TutorialAPI();
  api.connect(store);

  it.each(steps.map(s => [s.target, s.stateTransform]))
    (`attribute with className %s exists`, async (target, transform) => {
      api.statePush(transform);
      await Vue.nextTick();

      const el = wrapper.vm.$el.querySelector(target as string);
      expect(el).not.toBeNull()
  });
});
