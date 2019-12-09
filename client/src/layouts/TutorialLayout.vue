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
               + 'community loses 25 Upkeep.',
      params: {
        placement: 'bottom'
      }
    },
    {
      //  gamedashboard > containers > ContainerUpkeep.vue
      target: '.v-step-1',
      content: 'At the start of a round, if Upkeep is lower than 65, reveal 2 events; '
               + 'and if Upkeep is lower than 35 reveal 3 events. Conditions on Mars '
               + 'are tough!',
      params: {
        placement: 'bottom'
      }
    },
    // gamedashboard > Round.vue
    {
      target: '.v-step-2',
      content: 'The game progresses in rounds. There is an indefinite number '
               + 'of rounds per game. Therefore, the game can end at any time given '
               + 'that Upkeep does not decline to zero.',
      params: {
        placement: 'right'
      }
    },
    // gamedashboard > containers > ContainerTop.vue
    {
      target: '.v-step-3',
      content: 'There are multiple phases in a round: Events, Invest, Trade, Purchase '
               + ' and Discard. Each phase has a time limit of 5 minutes.',
      params: {
        placement: 'bottom',
      }
    },
    // gamedashboard > containers > ContainerBottom.vue
    {
      target: '.v-step-4',
      content: 'Events are revealed at the beginning of every round during the events phase. '
                + 'Some events can be more involved and require players to fulfill tasks '
                + 'that include voting. Mars is unpredictable; many different events can happen!',
      params: {
        placement: 'bottom',
      }
    },
    // gamedashboard > containers > ContainerPhase.vue
    {
      target: '.v-step-5',
      content: 'Events persisting multiple rounds or relevant to the current round '
               + 'will populate here.',
      params: {
        placement: 'left',
      }
    },
    // gamedashboard > Notfication.vue
    {
      target: '.v-step-6',
      content: 'You will be notifed about events and changes in Upkeep via notifications '
               + 'that pop up here. Hover over then notification to close it.',
      params: {
        placement: 'right',
      }
    },
    // gamedashboard > containers > ContainerLeft.vue
    {
      target: '.v-step-7',
      content: 'Any events and changes in upkeep that occur will be recorded in the Mars Log '
               + 'for your reference.',
      params: {
        placement: 'right',
      }
    },
    // gamedashboard > containers > ContainerProfile.vue
    {
      target: '.v-step-8',
      content: 'This is your role and score during the game. Your role determines '
               + 'the investments in influence currency you can make and the accomplishments '
               + 'that you can purchase toward the end of a round.',
      params: {
        placement: 'bottom',
      }
    },
    // gamedashboard > containers > ContainerPhase.vue
    {
      target: '.v-step-9',
      content: 'During the Investment phase, you may invest your timeblocks into '
               + 'Upkeep or purchase Influence currency.',
      params: {
        placement: 'right',
      }
    },
    // gamedashboard > containers > ContainerInvestments.vue
    {
      target: '.v-step-10',
      content: 'You are allocated 10 timeblocks (unless something says otherwise) to '
               + 'spend each round. You can spend timeblocks on Upkeep or on '
               + 'Influence. Remember that you have 5 minutes to invest your timeblocks.',
      params: {
        placement: 'top',
      }
    },
    // gamedashboard > containers > ContainerInvestments.vue
    {
      target: '.v-step-11',
      content: 'During the Investment phase, you can invest your timeblocks to obtain '
               + 'influence currency and use your influence currency inventory to trade '
               + 'with other players in the Trade phase.',
      params: {
        placement: 'right',
      }
    },
    // gamedashboard > containers > ContainerInvestments.vue
    {
      target: '.v-step-12',
      content: 'You can also use your timeblocks to keep your habitat from collapsing by '
               + 'investing your timeblocks in Upkeep.',
      params: {
        placement: 'right',
      }
    },
    // gamedashboard > containers > ContainerInvestments.vue
    {
      target: '.v-step-13',
      content: 'The cost of the card in timeblocks in located at the bottom right corner '
                + 'of the card. Use the increment (+) button on a card to invest your timeblocks or ' 
                + 'the decrement (-) button to remove timeblocks from an investment '
                + 'that you have made.',
      params: {
        placement: 'right',
      }
    },
    // gamedashboard > cards > CardInvestment.vue
    {
      target: '.v-step-14',
      content: 'You can hit the Done button to surrender your time if you have finished investing '
               + 'your timeblocks before the 5 minutes for the Investment Phase is up.',
      params: {
        placement: 'right',
      }
    }, 
    // gamedashboard > containers > ContainerLeft.vue
    {
      target: '.v-step-15',
      content: 'After you finish investing your timeblocks, your inventory will update here.',
      params: {
        placement: 'right',
      }
    },
    // gamedashboard > Chat.vue
    {
      target: '.v-step-16',
      content: 'During gameplay, you can communicate with other players in your habitat '
               + 'to plan and strategize.',
      params: {
        placement: 'left',
      }
    },
    // gamedashboard > containers > ContainerMembers.vue
    {
      target: '.v-step-17',
      content: 'These are the other residents of Port of Mars. There are 5 roles in the game: '
               + 'Researcher, Pioneer, Curator, Entrepreneur, and Politician.',
      params: {
        placement: 'left',
      }
    },
    // gamedashboard > containers > ContainerMembers.vue
    {
      target: '.v-step-17',
      content: 'These are the other residents of Port of Mars. There are 5 roles in the game: '
               + 'Researcher, Pioneer, Curator, Entrepreneur, and Politician.',
      params: {
        placement: 'left',
      }
    },
    // gamedashboard > containers > ContainerMembers.vue
    {
      target: '.v-step-18',
      content: 'The player score is displayed on the far left; name in the middle; '
               + 'and character art on the right.',
      params: {
        placement: 'left',
      }
    },
    // gamedashboard > containers > ContainerPhase.vue
    {
      target: '.v-step-19',
      content: 'During the Trade Phase, you can trade influence currency with other '
                + 'players. Trading allows you to obtain other influence currencies '
                + 'that you yourself cannnot invest in so that you can purchase '
                + 'accomplishments later in the game.',
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

    if (currentStep === 6) {
      this.$root.$emit('openEvent');
    }

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
    if (currentStep === 2) {
      this.$root.$emit('openEvent');
    }

    // close event view in BottomContainer
    if (currentStep === 5) {
      this.$root.$emit('closeEvent');
    }

    if (currentStep === 6) {
      this.$api.setNextPhase();
    }

    if (currentStep === 18) {
      this.$api.setNextPhase();
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
