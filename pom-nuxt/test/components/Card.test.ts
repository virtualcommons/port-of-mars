import { mount } from "@vue/test-utils";
import Card from "../../components/base/Card.vue";
import { describe, it, expect } from "vitest";

describe("Card.vue", () => {
  it("should render if title content matches", () => {
    const title = "This is a title";
    const testTitle = "This is a title";
    const initialColor = "success";
    const testInitialColor = "success";
    const wrapper = mount(Card, {
      props: { title, initialColor },
    });
    expect(wrapper.text()).toBe(testTitle);
    expect(wrapper.vm.initialColor).toBe(testInitialColor);
  });

  it("should render if props value matches", () => {
    const title = "This is a title";
    const testTitle = "This is a title";
    const initialColor = "success";
    const testInitialColor = "success";
    const wrapper = mount(Card, {
      props: { title, initialColor },
    });
    expect(wrapper.vm.title).toBe(testTitle);
    expect(wrapper.vm.initialColor).toBe(testInitialColor);
  });
});
