<template>
  <div class="tutorial-layout">
    <router-view />
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
                <button v-if="!tour.isFirst" @click="tour.previousStep" class="btn btn-dark">Previous</button>
                <button v-if="!tour.isLast" @click="tour.nextStep" class="btn btn-dark">Next</button>
                <button v-else-if="tour.isLast" @click="tour.stop" class="btn btn-dark">Finish</button>
              </div>
            </template>
          </v-step>
        </transition>
      </template>
    </v-tour>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import VueTour from 'vue-tour';

require('vue-tour/dist/vue-tour.css');


Vue.use(VueTour);

@Component({
  name: 'tutorial-layout'
})
export default class TutorialLayout extends Vue {
  // class for the active step element
  TOUR_ACTIVE_CLASS: string = 'tour-active';

  // class to show tour is active for click events
  BODY_TOUR: string = 'in-tour';

  tourCallbacks = {
    onStart: this.startTourCallback,
    onPreviousStep: this.previousStepCallback,
    onNextStep: this.nextStepCallback,
    onStop: this.stopTourCallback,
  };

  tourOptions = {
    // useKeyboardNavigation: false,
  }

  steps = [
    {
      //  containers > ContainerProfile.vue
      target: '#v-step-0',
      content: 'Welcome to Port of Mars! This is your role in the game. Your score is '
               + 'shown here and updated as you earn points during gameplay.',
      params: {
        placement: 'bottom'
      }
    },
    
    // containers > ContainerMembers.vue
    {
      target: '#v-step-1',
      content: 'Your team members and their respective scores are located here for your reference '
               + 'throughout the game.',
      params: {
        placement: 'bottom'
      }
    },

    // containers >
    {
      target: '#v-step-2',
      content: 'You can communicate with other players throughout the game by using the chat '
               + 'feature. Try sending a message now!',
      params: {
        placement: 'left'
      }
    },

    // containers > ContainerUpkeep.vue
    {
      target: '#v-step-3',
      content: 'Upkeep is your team\'s shared infrastructure. At the beginning of every round, '
                + 'Upkeep declines due to wear and tear. Without any investment by the residents, '
                + 'Upkeep will be reduced to zero.',
      params: {
        placement: 'bottom'
      }
    },
    {
      target: '#v-step-4',
      content: '',
      params: {
        placement: 'bottom'
      }
    },
  ];

  startTourCallback() {
    const currentStepElement = document.querySelector(this.steps[ 0 ].target);

    // add in-tour class to body
    document.body.classList.add(this.BODY_TOUR);

    // add active class for first step
    currentStepElement.classList.add(this.TOUR_ACTIVE_CLASS);
  }

  previousStepCallback(currentStep: any) {
    const currentStepElement = document.querySelector(this.steps[currentStep].target);
    const previousStepElement = document.querySelector(this.steps[currentStep - 1].target);

    // remove active step from current step
    currentStepElement.classList.remove(this.TOUR_ACTIVE_CLASS);

    // add active class to previous step
    previousStepElement.classList.add(this.TOUR_ACTIVE_CLASS);

    console.log(`[Vue Tour] A custom previousStep callback has been called on step
                ${currentStep + 1}`);
  }

  nextStepCallback(currentStep: any) {
    const currentStepElement = document.querySelector(this.steps[currentStep].target);
    const nextStepElement = document.querySelector(this.steps[currentStep + 1].target);

    // remove active step from current step
    currentStepElement.classList.remove(this.TOUR_ACTIVE_CLASS);

    // add active step to next step
    nextStepElement.classList.add(this.TOUR_ACTIVE_CLASS);

    console.log(`[Vue Tour] A custom nextStep callback has been called on step
                ${currentStep + 1}`);
  }

  stopTourCallback(currentStep: any) {
    // remove in-tour from body
    document.body.classList.remove(this.BODY_TOUR);

    // remove active class from body
    document.querySelector(`.${this.TOUR_ACTIVE_CLASS}`).classList.remove(this.TOUR_ACTIVE_CLASS);
  }

  /**
   * mounted() method
   * Starts the tour.
   *
   */
  mounted() {
    this.$tours.gameTour.start();
  }
}
</script>

<style>
.tutorial-layout {
  height: 100% !important;
  width: 100% !important;
}

/* custom tour css: highlight an element */

@keyframes shadow-pulse {
  0% {
    box-shadow: 0 0 0 0px rgba(255, 255, 255, 0.2);
  }

  100% {
    box-shadow: 0 0 0 35px rgba(0, 0, 0, 0);
  }
}

body .in-tour {
  pointer-events: none;
}

.v-step {
  z-index: 9999;
}

.tour-active {
  position: relative;
  z-index: 999;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0 10000px rgba(0, 0, 0, 0.5); /* outer black */
  /* animation: shadow-pulse 2s infinite; */
}

.tour-active, .v-tour {
  pointer-events: auto;
}

</style>
