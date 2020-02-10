<template>
  <div class="tutorial-layout">
    <TourModal @hide="startTourOnHideModal" />
    <GameDashboard />
    <v-tour name="gameTour" :steps="steps" :callbacks="tourCallbacks" :options="tourOptions">
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
                <button v-if="!tour.isFirst" @click="tour.previousStep" class="btn btn-dark">
                  Previous
                </button>
                <button v-if="!tour.isLast && api.forcePause" @click="tour.nextStep" class="btn btn-dark nextButton">
                  Next
                </button>
                <button v-else-if="tour.isLast && api.forcePause" @click="tour.stop" class="btn btn-dark">
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
import {Component, Provide, Vue} from 'vue-property-decorator';
import VueTour from 'vue-tour';
import TourModal from '@/components/tutorial/TourModal.vue';
import {TutorialAPI} from '@/api/tutorial/request';
import GameDashboard from "@/components/GameDashboard.vue";
import {initialStoreState, State} from "@/store/state";
import _ from "lodash";
import {Phase,RESEARCHER, CURATOR} from "shared/types";
import {Step} from "@/types/tutorial";
import { MockRoom } from '../types/tutorial';

import Steps from '@/api/tutorial/tutorialSteps';

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
 
  @Provide()
  api: TutorialAPI = new TutorialAPI();

  

  async created(){
    this.api.connect(this.$store);
  }

  // class for the active step element
  TOUR_ACTIVE_CLASS: string = 'tour-active';
  // class to show tour is active for click events
  BODY_TOUR: string = 'in-tour';
  tourCallbacks = {
    onStart: this.startTourCallback,
    onPreviousStep: this.previousStepCallback,
    onNextStep: this.nextStepCallback,
    onStop: this.stopTourCallback
  };
  tourOptions = {
    // useKeyboardNavigation: false,
  };

  steps: Array<Step> = Steps;
  
  

  /**
   * showModal() method
   * Show tour modal to introduce tour.
   *
   */
  showModal() {
    (this as any).$bvModal.show('bv-modal');
  }
  /**
   * startTourOnHideModal() method
   * Start tutorial when user closes intro tour modal.
   
   */
  startTourOnHideModal() {
    (this as any).$tours.gameTour.start();
  }
  startTourCallback() {
    
    const currentStepElement = this.$el.querySelector(this.steps[0].target);
    // add in-tour class to body
    this.$el.classList.add(this.BODY_TOUR);
    // add active class for first step
    currentStepElement!.classList.add(this.TOUR_ACTIVE_CLASS);
  }
  async previousStepCallback(currentStep: number) {    
    const currentStepElement = this.$el.querySelector(this.steps[currentStep].target);
    const previousStepElement = this.$el.querySelector(this.steps[currentStep - 1].target);
    // // remove active step from current step
    currentStepElement!.classList.remove(this.TOUR_ACTIVE_CLASS);
    // // add active class to previous step
    
    if(this.steps[currentStep].stateTransform != undefined){
      
      this.api.statePop();
      await this.$nextTick(); 
    }
    
    previousStepElement!.classList.add(this.TOUR_ACTIVE_CLASS);
  }
  async nextStepCallback(currentStep: number){
    this.api.statePush(this.steps[currentStep+1].stateTransform);
    await this.$nextTick();
    await this.$nextTick();

    const currentStepElement = this.$el.querySelector(this.steps[currentStep].target);
    const nextStepElement = this.$el.querySelector(this.steps[currentStep + 1].target);
    // // remove active step from current step
    currentStepElement!.classList.remove(this.TOUR_ACTIVE_CLASS);
    // // add active step to next step
    nextStepElement!.classList.add(this.TOUR_ACTIVE_CLASS);
  }
  stopTourCallback(currentStep: number) {
    // remove in-tour from body
    this.$el.classList.remove(this.BODY_TOUR);
    // remove active class from body
    this.$el.querySelector(`.${this.TOUR_ACTIVE_CLASS}`)!.classList.remove(this.TOUR_ACTIVE_CLASS);
  }
  /**
   * mounted() method
   * Show tour introductory modal.
   *
   */
  mounted() {
    this.showModal();
  }
}
</script>

<style lang="scss">
@import '@/stylesheets/layouts/TutorialLayout.scss';
</style>
