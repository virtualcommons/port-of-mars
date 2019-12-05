<template>
  <div class="tutorial-layout">
    <TourModal @hide="startTourOnHideModal"/>
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
import { Vue, Inject, Component } from 'vue-property-decorator';
import VueTour from 'vue-tour';
import TourModal from '@/tutorial/TourModal.vue';
import { RequestAPI } from '@/api/request';

require('vue-tour/dist/vue-tour.css');


Vue.use(VueTour);

@Component({
  name: 'tutorial-layout',
  components: {
    TourModal,
  }
})

export default class TutorialLayout extends Vue {
  @Inject()
  readonly $api!: RequestAPI;

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
      //  gamedashboard > containers > ContainerUpkeep.vue
      target: '.v-step-0',
      content: 'The game starts with Upkeep at 100. This represents the habitat at peak '
               + 'condition and maintenance. However, at the start of every round, the '
               + 'community loses 25 Upkeep. Conditions on Mars are tough!',
      params: {
        placement: 'bottom'
      }
    },
    // gamedashboard > Round.vue
    {
      target: '.v-step-1',
      content: 'The game progresses in rounds. There is an indefinite number '
               + 'of rounds per game. Therefore, the game can end at any time given '
               + 'that Upkeep does not decline to zero.',
      params: {
        placement: 'right'
      }
    },
    // gamedashboard > containers > ContainerTop.vue
    {
      target: '.v-step-2',
      content: 'There are multiple phases in a round: Events, Invest, Trade, Purchase '
               + ' and Discard. Each phase has a time limit of 5 minutes.',
      params: {
        placement: 'bottom',
      }
    },
    // gamedashboard > containers > ContainerBottom.vue
    {
      target: '.v-step-3',
      content: 'Events are revealed at the beginning of every round during the events phase. '
                + 'Some events can be more involved and require players to fulfill tasks '
                + 'that include voting. Mars is unpredictable; many different events can happen!',
      params: {
        placement: 'bottom',
      }
    },
    // gamedashboard > containers > ContainerPhase.vue
    {
      target: '.v-step-4',
      content: 'Events persisting multiple rounds or relevant to the current round '
               + 'will populate here. At the start of a round, if Upkeep is '
               + 'lower than 65, reveal 2 events; and if Upkeep is lower than 35 '
               + 'reveal 3 events.',
      params: {
        placement: 'left',
      }
    },
    // gamedashboard > containers > ContainerLeft.vue
    {
      target: '.v-step-5',
      content: 'Any events and changes in upkeep that occur will be recorded in the Mars Log '
               + 'for your reference.',
      params: {
        placement: 'right',
      }
    },
    // gamedashboard > containers > ContainerLeft.vue
    {
      target: '.v-step-6',
      content: 'This is your role and score during the game. Your role determines '
               + 'the investments in influence currency you can make and the accomplishments '
               + 'that you can purchase toward the end of a round.',
      params: {
        placement: 'right',
      }
    },
  ];

  /**
   * showModal() method
   * Show tour modal to introduce tour.
   * 
   */
  showModal() {
    this.$bvModal.show('bv-modal');
  }

  /**
   * startTourOnHideModal() method
   * Start tutorial when user closes intro tour modal.
   * 
   */
  startTourOnHideModal() {
    this.$tours.gameTour.start();
  }

  startTourCallback() {
    const currentStepElement = document.querySelector(this.steps[ 0 ].target);

    // add in-tour class to body
    document.body.classList.add(this.BODY_TOUR);

    // add active class for first step
    currentStepElement.classList.add(this.TOUR_ACTIVE_CLASS);

    // go to next events phase 5 seconds after tour starts
    setTimeout(() => {this.$api.setNextPhase()}, 6500);
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

    // if (currentStep === 2) {
    //   this.$root.$emit('closeEvent');
    // }
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

    // open event view im BottomContainer
    if (currentStep === 1) {
      this.$root.$emit('openEvent');
    }

    // close event view in BottomContainer
    if (currentStep === 3) {
      this.$root.$emit('closeEvent');
    }
  }

  stopTourCallback(currentStep: any) {
    // remove in-tour from body
    document.body.classList.remove(this.BODY_TOUR);

    // remove active class from body
    document.querySelector(`.${this.TOUR_ACTIVE_CLASS}`).classList.remove(this.TOUR_ACTIVE_CLASS);
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
