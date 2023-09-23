import { createLocalVue, shallowMountPOM, mountPOM } from "./common";
import App from "@port-of-mars/client/App.vue";

describe("App.vue", () => {
  it("renders", () => {
    const wrapper = shallowMountPOM(App);
    expect(wrapper.attributes("class")).toBe("h-100 p-0 m-0 bg");
  });
});
