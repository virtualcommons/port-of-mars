import Tutorial from '@port-of-mars/client/views/Tutorial.vue';
import { mockRoomSetup, mountPOM, provideClient } from './common';
import { Step, StateTransform } from '@port-of-mars/client/types/tutorial';
import { TutorialAPI } from '@port-of-mars/client/api/tutorial/request';
import Vue from 'vue';
jest.mock('@port-of-mars/client/components/game/static/chat/Chat.vue')


describe.skip('Tutorial.vue', () => {
  const wrapper = mountPOM(Tutorial, {
    ...mockRoomSetup(),
    ...provideClient()
  });
  const steps: Array<Step> = wrapper.vm.$data.steps;

  const store = wrapper.vm.$store;

  const api = new TutorialAPI();
  api.connect(store);

  it.each(steps.map(s => [s.target, s.stateTransform]))(
    `attribute with className %s exists`,
    async (target, transform) => {
      api.statePush(transform as Array<StateTransform> | undefined);
      await Vue.nextTick();

      const el = wrapper.vm.$el.querySelector(target as string);
      expect(el).not.toBeNull();
    }
  );
});


