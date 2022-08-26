import consent from "../../pages/consent.vue";
import { shallowMount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";

describe("consent page", () => {
  it("should not allow name less than 4 characters", () => {
    // render the component
    const wrapper = shallowMount(consent);

    // should not allow for `username` less than 4 characters, excludes whitespace
    wrapper.setData({ name: " ".repeat(4) });

    // assert the error is rendered
    expect(wrapper.find(".error").exists()).toBe(true);

    // update the name to be long enough
    wrapper.setData({ name: "John Doe" });
    // assert the error has gone away
    expect(wrapper.find(".error").exists()).toBe(false);
  });
});
