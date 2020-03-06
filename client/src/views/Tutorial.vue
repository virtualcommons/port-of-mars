<template>
  <div class="tutorial-layout">
    <ConsentFormModal @grant-consent="grantConsent" @deny-consent="denyConsent" />
    <TourModal v-if="consent" @hide="startTourOnHideModal" />
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
                  class="btn btn-dark button-active"
                >
                  Previous
                </button>
                <button
                  v-if="!tour.isLast"
                  v-on="{ click: api.forcePause ? tour.nextStep : () => {} }"
                  class="btn btn-dark"
                  v-bind="{ class: api.forcePause ? 'button-active' : 'button-inactive' }"
                >
                  Next
                </button>
                <button
                  v-else-if="tour.isLast"
                  v-on="{ click: api.forcePause ? tour.stop : () => {} }"
                  class="btn btn-dark"
                  v-bind="{ class: api.forcePause ? 'button-active' : 'button-inactive' }"
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
                  class="btn btn-dark button-active"
                  type="button"
                  name="button"
                >
                  Previous
                </button>
                <button
                  v-if="!tour.isLast"
                  v-on="{click: quizQuestionStatus ? tour.nextStep : ()=>{}}"
                  class="btn btn-dark"
                  v-bind="{class: quizQuestionStatus ? 'button-active' : 'button-inactive'}"
                  type="button"
                  name="button"
                >
                  Next
                </button>
                <button
                  v-if="tour.isLast"
                  v-on="{click: quizQuestionStatus ? tour.stop : ()=>{}}"
                  class="btn btn-dark"
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
import ConsentFormModal from '@/components/tutorial/ConsentFormModal.vue';
import TourModal from '@/components/tutorial/TourModal.vue';
import CompletedQuizModal from '@/components/tutorial/CompletedQuizModal.vue';
import GameDashboard from '@/components/GameDashboard.vue';
import { TutorialAPI } from '@/api/tutorial/request';
import { Step } from '@/types/tutorial';
import { CURATOR, Phase, QuizQuestionData, RESEARCHER } from 'shared/types';
import * as _ from 'lodash';

import { tutorialSteps } from '@/api/tutorial/tutorialSteps';

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
  }

  async mounted() {
    if (process.env.NODE_ENV != 'test') {
      this.dataFetched = await this.getQuizQuestions();
      if (this.dataFetched) {
        this.showModal();
      } else {
        // TODO: Handle server error
      }
    }
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

  private grantConsent() {
    this.consent = this.$store.state.consent;
    console.log('updated consent: ', this.consent)
  }

  private denyConsent() {
    this.consent = this.$store.state.consent;
  }

  // NOTE: Callbacks

  private startTourCallback() {
    const currentStepElement = this.$el.querySelector(this.steps[0].target);
    this.$el.classList.add(this.BODY_TOUR);
    currentStepElement!.classList.add(this.TOUR_ACTIVE_CLASS);
  }

  async previousStepCallback(currentStep: number) {
    if (this.steps[currentStep].stateTransform != undefined) {
      this.api.statePop();
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
    this.currentOptionIndex = -1;
    this.quizQuestionStatusMessage = '';
    this.quizQuestionStatus = false;
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
    const complete = await this.checkQuizCompletion();
    this.$ajax.setQuizCompletion(complete);
    console.log('USER HAS COMPLETED QUIZ:', complete);

    this.tourIsOver = true;
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
    if (result) {
      this.quizQuestionStatusMessage = 'Correct! Please click next.';
      this.quizQuestionStatus = true;
    } else {
      this.quizQuestionStatusMessage = 'Incorrect, please try again.';
    }
  }

  // NOTE: Server Fetches

  private async getSubmissionId(): Promise<boolean> {
    const submissionId = this.$ajax.submissionId;

    if (submissionId) {
      this.submissionId = submissionId;
      return true;
    } else {
      const quizUrl = `${process.env.SERVER_URL_HTTP}/quiz/create`;
      const response = await this.$ajax.post(quizUrl);

      if (response.status === 201) {
        const d = await response.json();
        const data = parseInt(d.submissionId);
        if (isNaN(data)) return false;
        this.submissionId = data;
        this.$ajax.setSubmissionId(data);
        return true;
      } else {
        const error = await response.json();
        this.notifyUserOfError('registerUser (response)', error);
        return false;
      }
    }

    return false;
  }

  private async getQuizQuestions(): Promise<boolean> {
    if (!this.getSubmissionId()) {
      return false;
    }

    const quizUrl = `${process.env.SERVER_URL_HTTP}/quiz/questions`;
    const response = await this.$ajax.get(quizUrl);

    if (response.status === 200) {
      this.quizQuestions = await response.json();
      return true;
    } else {
      const error = await response.json();
      this.notifyUserOfError('getQuizQuestions (response)', error);
      return false;
    }
    return false;
  }

  private async checkQuizQuestion(
    questionId: number,
    answer: number
  ): Promise<boolean> {
    const quizUrl = `${process.env.SERVER_URL_HTTP}/quiz/${this.submissionId}/${questionId}`;
    const response = await this.$ajax.post(quizUrl, { answer: answer });

    if (response.status === 200) {
      const data = await response.json();
      return data;
    } else {
      const error = await response.json();
      this.notifyUserOfError('checkQuizQuestion (response)', error);
    }
    return false;
  }

  private async checkQuizCompletion(): Promise<boolean> {
    const quizUrl = `${process.env.SERVER_URL_HTTP}/quiz/complete`;
    const response = await this.$ajax.get(quizUrl);

    if (response.status === 200) {
      const data = await response.json();
      return data;
    } else {
      const error = await response.json();
      this.notifyUserOfError('checkQuizCompletion (response)', error);
    }
    return false;
  }

  private notifyUserOfError(call: string, error: any): void {
    // TODO: Show server error modal
    console.log(`ERROR FETCHING DATA AT ${call}!`);
    console.log('RESPONSE FROM SERVER: ', error);
  }
}
</script>

<style lang="scss">
@import '@/stylesheets/layouts/TutorialLayout.scss';
</style>
