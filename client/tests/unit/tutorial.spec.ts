import Tutorial from "@/views/Tutorial.vue";
import App from "@/App.vue"
import {mockRoomSetup, mountPOM, provideClient} from "./common";

describe('Tutorial.vue', () => {
  const wrapper = mountPOM(Tutorial, {...mockRoomSetup(), ...provideClient()});
  const steps: Array<{ target: string}> = wrapper.vm.$data.steps;

  describe.each(steps.map(x => x.target))
    (`className`, (classSelector) => {
      it(`attribute with className ${classSelector} exists`, () => {
        const el = wrapper.element.querySelector(classSelector);
        expect(el).not.toBeNull()
      });
  });
});
