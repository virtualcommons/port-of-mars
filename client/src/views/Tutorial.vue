<template>
  <div class="tutorial-layout">
    <TourModal @hide="startTourOnHideModal" />
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
                  class="btn btn-dark"
                >
                  Previous
                </button>
                <button
                  v-if="!tour.isLast && api.forcePause"
                  @click="tour.nextStep"
                  class="btn btn-dark"
                >
                  Next
                </button>
                <button
                  v-else-if="tour.isLast && api.forcePause"
                  @click="tour.stop"
                  class="btn btn-dark"
                >
                  Finish
                </button>
              </div>
            </template>
            <template v-else>
              <div slot="actions">
                <p>{{ currentQuizQuestion.question }}</p>
                <div
                  class="option"
                  v-for="(option, index) in currentQuizQuestion.options"
                  :key="index"
                >
                  <button
                    @click="handleQuizQuestionSelection(index)"
                    type="button"
                    name="button"
                    :style="selectionStyle(index)"
                    class="question-selection"
                  ></button>
                  <p>{{ option }}</p>
                </div>
                <div>
                  <p class="status">{{ quizQuestionStatusMessage }}</p>
                </div>
                <button
                  v-if="!tour.isFirst"
                  @click="tour.previousStep"
                  class="btn btn-dark"
                  type="button"
                  name="button"
                >
                  Previous
                </button>
                <button
                  v-if="
                    currentQuizQuestionSelection !== -1 &&
                      quizQuestionStatus === false
                  "
                  @click="handleCheckQuizQuestion"
                  type="button"
                  name="button"
                >
                  Check Answer
                </button>
                <button
                  v-if="quizQuestionStatus && !tour.isLast && api.forcePause"
                  @click="tour.nextStep"
                  class="btn btn-dark"
                  type="button"
                  name="button"
                >
                  Next
                </button>
                <button
                  v-if="quizQuestionStatus && tour.isLast && api.forcePause"
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

  steps: Array<Step> = tutorialSteps;

  private dataFetched: boolean = false;
  //private steps: Array<Step> = [];
  private quizQuestions: Array<QuizQuestionData> = [];
  private currentTutorialElementId: string = '';

  // TODO: Need to reset
  private currentQuizQuestionSelection: number = -1;
  private quizQuestionStatusMessage: string = '';
  private quizQuestionStatus: boolean = false;

  // NOTE: Lifecyle Hooks

  created() {
    this.api.connect(this.$store);
    //this.steps = new TutorialSteps(this.playerRole).steps;
    // console.log(this.steps);
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
    this.currentQuizQuestionSelection = -1;
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

  private handleQuizQuestionSelection(index: number): void {
    this.currentQuizQuestionSelection = index;
  }

  async handleCheckQuizQuestion() {
    const result = await this.checkQuizQuestion(
      this.currentQuizQuestion.id,
      this.currentQuizQuestionSelection
    );
    if (result) {
      this.quizQuestionStatusMessage = 'Correct! Please click next.';
      this.quizQuestionStatus = true;
    } else {
      this.quizQuestionStatusMessage = 'Incorrect, please try again.';
    }
  }

  private selectionStyle(index: number) {
    if (index === this.currentQuizQuestionSelection) {
      return { backgroundColor: 'var(--new-space-orange)' };
    }
    return {};
  }

  // NOTE: Server Fetches

  private async registerUser(): Promise<boolean> {
    const quizUrl = `${process.env.SERVER_URL_HTTP}/quiz`;
    const jwt = localStorage.getItem('jwt');

    if (!jwt) {
      const error = 'No user token found.';
      this.notifyUserOfError('registerUser (jwt check): ' + error);
      return false;
    }

    const response = await fetch(quizUrl, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer'
    });
    if (response.status === 200) {
      return true;
    } else {
      const error = await response.json();
      this.notifyUserOfError('registerUser (response): ' + error);
    }
    return false;
  }

  private async getQuizQuestions(): Promise<boolean> {
    const quizUrl = `${process.env.SERVER_URL_HTTP}/quiz`;

    if (!this.registerUser()) {
      return false;
    }

    const jwt = localStorage.getItem('jwt');

    // const response = await this.$ajax.get(quizUrl);

    const response = await fetch(quizUrl, {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer'
    });

    if (response.status === 200) {
      const data: Array<QuizQuestionData> = await response.json();
      this.quizQuestions = data;
      // console.log(this.quizQuestions);
      return true;
    } else {
      const error = await response.json();
      this.notifyUserOfError('getQuizQuestions (response): ' + error);
    }
    return false;
  }

  private async checkQuizQuestion(
    questionId: number,
    answer: number
  ): Promise<boolean> {
    const quizUrl = `${process.env.SERVER_URL_HTTP}/quiz/${questionId}`;
    const jwt = localStorage.getItem('jwt');

    if (!jwt) {
      const error = 'No user token found.';
      this.notifyUserOfError('checkQuizQuestion (jwt check): ' + error);
      return false;
    }

    const data: object = { answer: answer };
    // const response = await this.$ajax.post(quizUrl, { choice });
    const response = await fetch(quizUrl, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });

    if (response.status === 200) {
      const data = await response.json();
      return data;
    } else {
      const error = await response.json();
      this.notifyUserOfError('checkQuizQuestion (response): ' + error);
    }
    return false;
  }

  private notifyUserOfError(error: string): void {
    // TODO: Show server error modal
    console.log('ERROR FETCHING DATA: ', error);
  }
}
</script>

<style lang="scss">
@import '@/stylesheets/layouts/TutorialLayout.scss';
</style>
