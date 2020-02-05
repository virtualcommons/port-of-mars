<template>
  <div class="tutorial-layout">
    <TourModal @hide="startTourOnHideModal" />
    <GameDashboard />
    <v-tour
      name="gameTour"
      :steps="steps"
      :callbacks="tourCallbacks"
      :options="tourOptions"
    >
      <template v-slot="tour">
        <transition name="fade">
          <v-step
            v-if="tour.currentStep === index"
            v-for="(step, index) of tour.steps"
            :key="index"
            :step="step"
            :previous-step="tour.previousStep"
            :next-step="tour.nextStep"
            :stop="tour.stop"
            :is-first="tour.isFirst"
            :is-last="tour.isLast"
            :labels="tour.labels"
          >
            <template>
              <div slot="actions">
                <button
                  v-if="!tour.isFirst"
                  @click="tour.previousStep"
                  class="btn btn-dark"
                >
                  Previous
                </button>
                <button
                  v-if="!tour.isLast"
                  @click="tour.nextStep"
                  class="btn btn-dark"
                >
                  Next
                </button>
                <button
                  v-else-if="tour.isLast"
                  @click="tour.stop"
                  class="btn btn-dark"
                >
                  Finish
                </button>
              </div>
            </template>
          </v-step>
        </transition>
      </template>
    </v-tour>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue } from 'vue-property-decorator';
import VueTour from 'vue-tour';
import TourModal from '@/components/tutorial/TourModal.vue';
import GameDashboard from '@/components/GameDashboard.vue';
import { TutorialAPI } from '@/api/tutorial/request';
import { TutorialSteps } from '@/repositories/tutorial';

require('vue-tour/dist/vue-tour.css');
Vue.use(VueTour);

@Component({
  name: 'tutorial',
  components: {
    GameDashboard,
    TourModal
  }
})
export default class Tutorial extends Vue {
  @Provide() api: TutorialAPI = new TutorialAPI();

  private TOUR_ACTIVE_CLASS: string = 'tour-active';
  private BODY_TOUR: string = 'in-tour';
  private tourOptions = {
    // useKeyboardNavigation: false,
  };
  private tourCallbacks = {
    onStart: this.startTourCallback,
    onPreviousStep: this.previousStepCallback,
    onNextStep: this.nextStepCallback,
    onStop: this.stopTourCallback
  };
  private steps = new TutorialSteps(this.playerRole).steps;

  // NOTE: Lifecyle Hooks

  private created() {
    this.api.connect(this.$store);
  }

  private mounted() {
    this.showModal();
  }

  // NOTE: Initialize

  get playerRole() {
    return this.$store.state.role;
  }

  private showModal() {
    (this as any).$bvModal.show('bv-modal');
  }

  private startTourOnHideModal() {
    (this as any).$tours.gameTour.start();
  }

  // NOTE: Callbacks

  private startTourCallback() {
    const currentStepElement = this.$el.querySelector(this.steps[0].target);
    this.$el.classList.add(this.BODY_TOUR);
    currentStepElement!.classList.add(this.TOUR_ACTIVE_CLASS);
  }

  async previousStepCallback(currentStep: number) {
    if (this.steps[currentStep].stateTransform != undefined) {
      this.api.statePop(1);
      await this.$nextTick();
    }
    const currentStepElement = this.$el.querySelector(
      this.steps[currentStep].target
    );
    const previousStepElement = this.$el.querySelector(
      this.steps[currentStep - 1].target
    );
    currentStepElement!.classList.remove(this.TOUR_ACTIVE_CLASS);
    previousStepElement!.classList.add(this.TOUR_ACTIVE_CLASS);
  }

  async nextStepCallback(currentStep: number) {
    this.api.statePush(this.steps[currentStep + 1].stateTransform);
    await this.$nextTick();
    const currentStepElement = this.$el.querySelector(
      this.steps[currentStep].target
    );
    const nextStepElement = this.$el.querySelector(
      this.steps[currentStep + 1].target
    );
    currentStepElement!.classList.remove(this.TOUR_ACTIVE_CLASS);
    nextStepElement!.classList.add(this.TOUR_ACTIVE_CLASS);
  }

  async stopTourCallback(currentStep: number) {
    await this.$el.classList.remove(this.BODY_TOUR);
    await this.$el
      .querySelector(`.${this.TOUR_ACTIVE_CLASS}`)!
      .classList.remove(this.TOUR_ACTIVE_CLASS);

    // TODO: NAVIGATE TO QUIZ
    console.log('TOUR FINISHED, NAVIGATE TO QUIZ');
    this.navigateToQuiz();
  }

  // NOTE: Integrate Quiz

  private async navigateToQuiz() {
    // this.$router.push({ name: 'TutorialQuiz' });
  }
}
</script>

<style lang="scss">
@import '@/stylesheets/layouts/TutorialLayout.scss';
</style>
