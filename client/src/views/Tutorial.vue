<template>
  <div class="tutorial-layout">
    <TourModal @show="showTour" @hide="startTourOnHideModal" />
    <CompletedQuizModal v-if="tourIsOver" />
    <GameDashboard />
    <v-tour
      v-if="dataFetched"
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
            <template v-if="!isQuizQuestion(tour.currentStep)">
              <div slot="actions">
                <button
                  v-if="!tour.isFirst"
                  @click="tour.previousStep"
                  class="btn btn-dark button-active previous-button"
                >
                  Previous
                </button>
                <button
                  v-if="!tour.isLast"
                  ref="forwardButton"
                  v-on="{ click: api.hasCompletedAction ? tour.nextStep : () => {} }"
                  :disabled="!api.hasCompletedAction"
                  class="btn btn-dark next-button"
                  v-bind="{ class: api.hasCompletedAction ? 'button-active' : 'button-inactive' }"
                >
                  Next
                </button>
                <button
                  v-else-if="tour.isLast"
                  v-on="{ click: api.hasCompletedAction ? tour.stop : () => {} }"
                  class="btn btn-dark next-button"
                  v-bind="{ class: api.hasCompletedAction ? 'button-active' : 'button-inactive' }"
                  ref="forwardButton"
                >
                  Finish
                </button>
              </div>
            </template>
            <template v-else>
              <div slot="actions">
                <p>{{ currentQuizQuestion.question }}</p>
                <div
                  class="option-container row">
                  <label class="options"
                  v-for="(option, optionIndex) in currentQuizQuestion.options"
                  :key="optionIndex + Math.random()"
                  >
                    <input type="radio"
                    :value="optionIndex"
                    v-model="currentOptionIndex"
                    @change="handleCheckQuizQuestion(optionIndex)"

                    >
                    <span> {{option}} </span>
                  </label>
                </div>
                <div>
                  <p v-bind="{class: quizQuestionStatus ? 'status-correct' : 'status-wrong'}">{{ quizQuestionStatusMessage }}</p>
                </div>
                <button
                  v-if="!tour.isFirst"
                  @click="tour.previousStep"
                  class="btn btn-dark button-active previous-button"
                  type="button"
                  name="button"
                >
                  Previous
                </button>
                <button
                  v-if="!tour.isLast"
                  v-on="{click: quizQuestionStatus ? tour.nextStep : ()=>{}}"
                  class="btn btn-dark next-button"
                  v-bind="{class: quizQuestionStatus ? 'button-active' : 'button-inactive'}"
                  type="button"
                  name="button"
                >
                  Next
                </button>
                <button
                  v-if="tour.isLast"
                  v-on="{click: quizQuestionStatus ? tour.stop : ()=>{}}"
                  class="btn btn-dark next-button"
                  v-bind="{class: quizQuestionStatus ? 'button-active' : 'button-inactive'}"
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
import TourModal from '@port-of-mars/client/components/tutorial/TourModal.vue';
import CompletedQuizModal from '@port-of-mars/client/components/tutorial/CompletedQuizModal.vue';
import GameDashboard from '@port-of-mars/client/components/GameDashboard.vue';
import { QuizAPI } from '@port-of-mars/client/api/tutorial/quiz';
import { TutorialAPI } from '@port-of-mars/client/api/tutorial/request';
import { tutorialSteps } from '@port-of-mars/client/api/tutorial/steps';
import { Step } from '@port-of-mars/client/types/tutorial';
import { url } from '@port-of-mars/client/util';
import { CURATOR, Phase, QuizQuestionData, RESEARCHER } from '@port-of-mars/shared/types';

import { isStagingOrProduction, isTest } from '@port-of-mars/shared/settings';


import * as _ from 'lodash';
import { LOGIN_PAGE } from '@port-of-mars/shared/routes';

require('vue-tour/dist/vue-tour.css');
Vue.use(VueTour);

@Component({
  name: 'tutorial',
  components: {
    GameDashboard,
    CompletedQuizModal,
    TourModal
  }
})
export default class Tutorial extends Vue {
  @Provide() api: TutorialAPI = new TutorialAPI();

  readonly quiz:QuizAPI = new QuizAPI();

  private TOUR_ACTIVE_CLASS: string = 'tour-active';
  private BODY_TOUR: string = 'in-tour';
  private tourCallbacks = {
    onStart: this.startTourCallback,
    onPreviousStep: this.previousStepCallback,
    onNextStep: this.nextStepCallback,
    onStop: this.stopTourCallback
  };

  private steps: Array<Step> = tutorialSteps;
  private tourIsOver: boolean = false;
  private consent: boolean = false;

  private dataFetched: boolean = false;
  private quizQuestions: Array<QuizQuestionData> = [];
  private currentTutorialElementId: string = '';

  // TODO: Need to reset
  private currentOptionIndex: number = -1;
  private quizQuestionStatusMessage: string = '';
  private quizQuestionStatus: boolean = false;

  // NOTE: Lifecycle Hooks

  created() {
    this.api.connect(this.$store);
    this.quiz.connect(this.$ajax);
    this.api.resetState();
  }

  async mounted() {

    if (! isTest()) {
      this.quizQuestions = await this.quiz.initalizeQuiz();
      if (this.quizQuestions.length > 0) {
        this.dataFetched = true;
      }
      this.showModal();
    }

  }

  get tourOptions() {
    return { useKeyboardNavigation: this.isKeyboardNavigationEnabled };
  }

  get isKeyboardNavigationEnabled() {
    return ! isStagingOrProduction();
  }

  // NOTE: Initialize

  get playerRole() {
    return this.$store.state.role;
  }

  private showModal() {
    (this as any).$bvModal.show('bv-modal');
  }

  private showTour() {
    if (this.consent) this.showModal();
  }

  private startTourOnHideModal() {
    (this as any).$tours.gameTour.start();
  }

  private forceLogoutUser(): void {
    this.$ajax.forgetLoginCreds();
    this.$router.push({ name: LOGIN_PAGE });
  }

  // NOTE: Callbacks

  private startTourCallback() {
    const currentStepElement = this.$el.querySelector(this.steps[0].target);
    this.$el.classList.add(this.BODY_TOUR);
    currentStepElement!.classList.add(this.TOUR_ACTIVE_CLASS,'animate-current-step');
  }

  async previousStepCallback(currentStep: number) {

    const currentStepElement = this.$el.querySelector(
      this.steps[currentStep].target
    );

    if (this.steps[currentStep].stateTransform != undefined) {
      this.api.statePop();
      await this.$nextTick();
    }

    const previousStepElement = this.$el.querySelector(
      this.steps[currentStep - 1].target
    );
    currentStepElement!.classList.remove(this.TOUR_ACTIVE_CLASS,'animate-current-step');
    previousStepElement!.classList.add(this.TOUR_ACTIVE_CLASS,'animate-current-step');
  }

  async nextStepCallback(currentStep: number) {
    this.currentOptionIndex = -1;
    this.quizQuestionStatusMessage = '';
    this.quizQuestionStatus = false;
    const currentStepElement = this.$el.querySelector(
      this.steps[currentStep].target
    );

    this.api.statePush(this.steps[currentStep + 1].stateTransform);
    await this.$nextTick();

    const nextStepElement = this.$el.querySelector(
      this.steps[currentStep + 1].target
    );
    currentStepElement!.classList.remove(this.TOUR_ACTIVE_CLASS,'animate-current-step');
    nextStepElement!.classList.add(this.TOUR_ACTIVE_CLASS,'animate-current-step');

    //this will set the forward button to the 'next' button, or the 'finish' button, depending on the context.
    this.api.registerRef(this.$refs.forwardButton);
  }

  async stopTourCallback(currentStep: number) {
    await this.$el.classList.remove(this.BODY_TOUR);
    await this.$el
      .querySelector(`.${this.TOUR_ACTIVE_CLASS}`)!
      .classList.remove(this.TOUR_ACTIVE_CLASS,'animate-current-step');
    await this.quiz.checkQuizCompletion();
    this.tourIsOver = true;
    this.api.resetState();
  }

  // NOTE: Integrate Quiz

  private isQuizQuestion(currentStep: number): boolean {
    if (this.steps[currentStep].params.tutorialElementId !== undefined) {
      this.currentTutorialElementId = this.steps[
        currentStep
      ].params.tutorialElementId!;
      return true;
    }
    return false;
  }

  get currentQuizQuestion() {
    const index = _.findIndex(this.quizQuestions, [
      'tutorialElementId',
      this.currentTutorialElementId
    ]);
    return this.quizQuestions[index];
  }


  async handleCheckQuizQuestion(value:number) {
    const result = await this.quiz.checkQuizQuestion(
      this.currentQuizQuestion.id,
      value
    );
    if(!this.quizQuestionStatus){
      if (result) {
        this.quizQuestionStatusMessage = 'Correct! Please click next.';
        this.quizQuestionStatus = true;
      } else {
        this.quizQuestionStatusMessage = 'Incorrect, please try again.';
      }
    } else{
      this.quizQuestionStatusMessage = 'You already answered correctly. Please click next.';
    }
  }

}
</script>

<style lang="scss">
@import '@port-of-mars/client/stylesheets/layouts/TutorialLayout.scss';
</style>
