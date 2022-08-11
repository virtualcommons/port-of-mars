<script setup lang="ts">
import { defineProps, resolveComponent } from "vue";
import { ref, computed } from "vue";
const props = defineProps({
  to: {
    type: String,
    default: null,
    required: false,
  },
  href: {
    type: String,
    default: null,
    required: false,
  },
  initialColor: {
    type: String,
    required: true,
    // validator(value) {
    //   // The value must match one of these strings
    //   return ["success", "warning", "danger"].includes(value);
    // },
  },
});

// color only uses props.initialColor as the initial value;
// it is disconnected from future prop updates.
const color = ref(props.initialColor);

const main = computed(() => color.value === "main");
const success = computed(() => color.value === "success");
const warning = computed(() => color.value === "warning");
const error = computed(() => color.value === "error");

const nuxtLinkComponent = resolveComponent("NuxtLink");
const buttonComponent = resolveComponent("button");
</script>

<template>
  <component
    :is="to ? nuxtLinkComponent : href ? 'a' : buttonComponent"
    :to="to"
    :href="href"
    @click="$emit('click')"
    class="text-white font-semibold rounded-md p-2"
    :class="[
      { 'bg-main': main },
      { 'bg-amber-700': warning },
      { 'bg-red-700': error },
    ]"
  >
    <slot></slot>
  </component>
</template>
