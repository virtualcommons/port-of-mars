<template>
  <ol class="stepper">
    <li
      v-for="(step, index) in steps"
      :key="step.name"
      :class="['stepper-item', step.completed ? 'stepper-item-completed' : '']"
    >
      <p
        :class="[
          'step-dot',
          step.completed || step === activeStep ? 'step-dot-active-completed' : '',
        ]"
      >
        {{ index + 1 }}
      </p>
      <p class="step-name">
        <small>{{ step.name }}</small>
      </p>
    </li>
  </ol>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

interface Step {
  name: string;
  icon?: string; // bootstrap icon name, currently unused
  component?: any; // vue component
  completed: boolean;
}

@Component({})
export default class Stepper extends Vue {
  @Prop()
  steps: Array<Step>;

  @Prop()
  activeStep: Step;

  currentStep: Step;
}
</script>

<style lang="scss" scoped>
.stepper {
  display: flex;
  padding: 0;
}

.stepper-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
}

.stepper-item:not(:last-child):after {
  content: "";
  position: relative;
  top: 2rem;
  left: 50%;
  height: 2px;
  background-color: var(--light-shade);
  order: -1;
}

.stepper-item-completed:not(:last-child):after {
  background-color: $primary !important;
}

.step-dot {
  position: relative;
  z-index: 9999;
  display: block;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  color: var(--dark-shade);
  background-color: var(--light-shade);
  margin: 1rem auto 0;
}

.step-dot-active-completed {
  color: var(--light-shade);
  background-color: $primary !important;
}
</style>
