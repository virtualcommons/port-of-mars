<template>
  <b-container fluid class="h-100 w-100 d-flex justify-content-center align-items-center">
    <div id="onboarding-container">
      <component :is="activeStep.component" @completed="advanceStep"></component>
      <hr>
      <Stepper
        :steps="onboardingSteps"
        :activeStep="activeStep"
      ></Stepper>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { url } from "@port-of-mars/client/util";
import Stepper from "@port-of-mars/client/components/global/Stepper.vue";
import Verify from "@port-of-mars/client/components/onboarding/Verify.vue";
import Consent from "@port-of-mars/client/components/onboarding/Consent.vue";
import Tutorial from "@port-of-mars/client/components/onboarding/Tutorial.vue";
import Play from "@port-of-mars/client/components/onboarding/Play.vue";
import { isDevOrStaging } from "@port-of-mars/shared/settings";
import { USERNAME_PAGE } from "@port-of-mars/shared/routes";

@Component({
  components: {
    Stepper,
    Verify,
    Consent,
    Tutorial,
    Play,
  }
})
export default class Onboarding extends Vue {
  isDevMode: boolean = false;

  onboardingSteps = [
    {name: "Consent", component: Consent, completed: false},
    {name: "Verify Email", component: Verify, completed: false},
    {name: "Tutorial", component: Tutorial, completed: false},
    {name: "Play", component: Play, completed: false},
  ];
  // TODO: use store so we can track step when email is verified for example
  activeStep = this.onboardingSteps[0];

  usernamePage = { name: USERNAME_PAGE };
  
  async created() {
    this.isDevMode = isDevOrStaging();
  }

  advanceStep() {
    const index = this.onboardingSteps.indexOf(this.activeStep);
    this.onboardingSteps[index].completed = true;
    if (index >= 0 && index < this.onboardingSteps.length - 1) {
      this.activeStep = this.onboardingSteps[index + 1];
    }
  }
}
</script>

<style lang="scss" scoped>

hr {
  margin: 2rem 0 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

#onboarding-container {
  padding: 2rem;
  border-radius: 1rem;
  margin-top: -10rem;
  width: 60rem;
  background-color: rgba(0, 0, 0, 0.25);
}

</style>