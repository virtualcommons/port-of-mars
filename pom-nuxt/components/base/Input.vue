<script setup lang="ts">
import { text } from "stream/consumers";
import { ref, computed } from "vue";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "text",
    required: true,
  },
  placeholder: {
    type: String,
    default: "Placeholder text...",
    required: false,
  },
  modelValue: {
    type: String,
    default: "",
    required: false,
  },
});
</script>

<template>
  <label>
    {{ label }}
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </label>
</template>
