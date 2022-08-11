<script setup lang="ts">
import { ref, computed } from "vue";

export type Card = "Task" | "Game";
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    // validator(value) {
    //   // The value must match one of these strings
    //   return ["success", "warning", "danger"].includes(value);
    // },
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

const success = computed(() => color.value === "success");
const warning = computed(() => color.value === "warning");
const error = computed(() => color.value === "error");
</script>

<template>
  <div
    :class="[
      { 'bg-emerald-700': success },
      { 'bg-amber-700': warning },
      { 'bg-red-700': error },
    ]"
    class="flex items-center rounded p-3 w-3/4"
  >
    <div class="flex-1">
      <h5 class="font-medium leading-tight text-xl">{{ title }}</h5>
      <span v-if="subtitle">{{ subtitle }}</span>
    </div>

    <!-- status icon indicator -->
    <template v-if="status">
      <svg
        v-if="status === 'complete'"
        class="flex-none"
        height="30"
        width="30"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="{2}"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <svg
        v-else-if="status === 'incomplete'"
        class="flex-none"
        height="30"
        width="30"
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <svg
        v-else-if="status === 'online'"
        class="flex-none"
        height="30"
        width="30"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="{2}"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z"
        />
      </svg>
      <svg
        v-else-if="status === 'offline'"
        class="flex-none"
        height="30"
        width="30"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="{2}"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
        />
      </svg>
    </template>
  </div>
</template>
