<template>
  <div class="tutorial-layout">
    <!-- <ConsentFormModal @grant-consent="grantConsent" @deny-consent="denyConsent" /> -->
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
                  class="option-container">
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
import ConsentFormModal from '@port-of-mars/client/components/tutorial/ConsentFormModal.vue';
import TourModal from '@port-of-mars/client/components/tutorial/TourModal.vue';
import CompletedQuizModal from '@port-of-mars/client/components/tutorial/CompletedQuizModal.vue';
import GameDashboard from '@port-of-mars/client/components/GameDashboard.vue';
import { TutorialAPI } from '@port-of-mars/client/api/tutorial/request';
import { Step } from '@port-of-mars/client/types/tutorial';
import { CURATOR, Phase, QuizQuestionData, RESEARCHER } from '@port-of-mars/shared/types';
import * as _ from 'lodash';

import { tutorialSteps } from '@port-of-mars/client/api/tutorial/steps';

require('vue-tour/dist/vue-tour.css');
Vue.use(VueTour);

@Component({
  name: 'tutorial',
  components: {
    GameDashboard,
    CompletedQuizModal,
    TourModal,
    ConsentFormModal
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

  private steps: Array<Step> = tutorialSteps;
  private tourIsOver: boolean = false;
  private consent: boolean = false;

  private submissionId: any = null;
  private dataFetched: boolean = false;
  private quizQuestions: Array<QuizQuestionData> = [];
  private currentTutorialElementId: string = '';

  // TODO: Need to reset
  private currentOptionIndex: number = -1;
  private quizQuestionStatusMessage: string = '';
  private quizQuestionStatus: boolean = false;

  // NOTE: Lifecyle Hooks

  created() {
    this.api.connect(this.$store);
    this.api.resetState();
    
  }

  async mounted() {

    if (process.env.NODE_ENV != 'test') {
      await this.initalizeQuiz();
      this.showModal();
    }
    
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

  private grantConsent() {
    this.consent = this.$tstore.state.consent;
    console.log('updated consent: ', this.consent)
  }

  private denyConsent() {
    this.consent = this.$tstore.state.consent;
    this.forceLogoutUser();
    console.log('updated consent: ', this.consent)
  }

  private forceLogoutUser(): void {
    this.$ajax.forgetLoginCreds();
    this.$router.push({ name: 'Login' });
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
    const complete = await this.checkQuizCompletion();
    this.$ajax.setQuizCompletion(complete);
    console.log('USER HAS COMPLETED QUIZ:', complete);

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
    const result = await this.checkQuizQuestion(
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

  get quizSubmissionEndpoint() {
    return `${process.env.SERVER_URL_HTTP}/quiz/submission`;
  }

  private setSubmissionId(submissionId: number) {
    this.$ajax.setSubmissionId(submissionId);
    this.submissionId = submissionId;
  }


  // NOTE: Server Fetches
  private async initalizeQuiz() {
    let submissionId = this.$ajax.submissionId;
    let response;
    if (submissionId) {
      const retrieveSubmissionUrl = `${this.quizSubmissionEndpoint}/${submissionId}`;
      response = await this.$ajax.get(retrieveSubmissionUrl);
      console.log(`retrieving submission with id ${submissionId}`);
    }
    else {
      const createQuizSubmissionUrl = this.quizSubmissionEndpoint;
      response = await this.$ajax.post(createQuizSubmissionUrl);
      console.log('creating new submission');
    }
    const jsonData = await response.json();
    console.log(jsonData);
    this.setSubmissionId(jsonData.submissionId);
    this.quizQuestions = jsonData.quizQuestions;
    this.dataFetched = true;
  }

  private async checkQuizQuestion(questionId: number, answer: number): Promise<boolean> {
    const submitResponseUrl = `${this.quizSubmissionEndpoint}/${this.submissionId}/${questionId}`;
    const response = await this.$ajax.post(submitResponseUrl, { answer: answer });
    return await response.json();
  }

  private async checkQuizCompletion(): Promise<boolean> {
    const quizCompletionUrl = `${process.env.SERVER_URL_HTTP}/quiz/complete`;
    const response = await this.$ajax.get(quizCompletionUrl);
    if (response.status === 200) {
      const data = await response.json();
      return data;
    } else {
      const error = await response.json();
      this.notifyUserOfError('checkQuizCompletion (response)', error);
      return false;
    }
  }

  private notifyUserOfError(call: string, error: any): void {
    // TODO: Show server error modal
    console.log(`ERROR FETCHING DATA AT ${call}!`);
    console.log('RESPONSE FROM SERVER: ', error);
  }
}
</script>

<style lang="scss">
@import '@port-of-mars/client/stylesheets/layouts/TutorialLayout.scss';
</style>
