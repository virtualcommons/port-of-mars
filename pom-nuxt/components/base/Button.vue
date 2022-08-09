<script setup lang="ts">
defineProps({
  to: {
    type: String,
    default: null,
  },
  href: {
    type: String,
    default: null,
  },
});
const nuxtLinkComponent = resolveComponent("NuxtLink");
const buttonComponent = resolveComponent("button");
</script>

<template>
  <component
    :is="to ? nuxtLinkComponent : href ? 'a' : buttonComponent"
    :to="to"
    :href="href"
    @click="$emit('click')"
    class="rounded-md bg-sky-400 hover:bg-sky-400/50 p-2"
  >
    <slot></slot>
  </component>
</template>
