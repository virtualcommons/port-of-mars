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
                <button @click="tour.previousStep" class="btn btn-dark">Previous</button>
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
  TOUR_ACTIVE_CLASS: string = 'tour-active';
  BODY_TOUR: string = 'in-tour';

  tourCallbacks = {
    onStart: this.startTourCallback,
    onPreviousStep: this.previousStepCallback,
    onNextStep: this.nextStepCallback,
    onStop: this.stopTourCallback,
  };

  tourOptions = {
    useKeyboardNavigation: false,
  }

  steps = [
    {
      //  Profile.vue
      target: '#v-step-0',
      content: 'Welcome to Port of Mars, Curator! This is your profile. You can click here to'
               + 'learn more about your character.',
      params: {
        placement: 'right'
      }
    },
    {
      // ContainerRight.vue
      target: '#v-step-1',
      content: 'Your team members and scores are displayed here.',
      params: {
        placement: 'left'
      }
    },
    {
      // ContainerRight.vue > Chat
      target: '#v-step-2',
      content: 'You can communicate with your team members in this chat window throughout the'
                + 'game.',
      params: {
        placement: 'left'
      }
    },
    {
      // ContainerLeft.vue > <Round />
      target: '#v-step-3',
      content: 'The current round number will be displayed here. There is an indefinite number'
               + 'of rounds per game.',
      params: {
        placement: 'right'
      }
    },
    {
      // ContainerLeft.vue > <Notifcation />
      target: '#v-step-4',
      content: 'Notifications will be displayed here throughout gameplay.',
      params: {
        placement: 'bottom'
      }
    },
    {
      // ContainerLeft.vue > <MarsLog />
      target: '#v-step-5',
      content: 'After the notifications disappear, they will be logged in the Mars Log.'
               + 'This will display a history of events that have occured throughout the'
               + 'game for your reference.',
      params: {
        placement: 'right'
      }
    },
    {
      // ContainerTop.vue > <ContainerUpkeep />
      target: '#v-step-6',
      content: 'This bar represents Upkeep, your teams shared infrastructure. Each round the upkeep'
               + 'level declines due to wear and tear, and without any investment by the'
               + 'residents, the Upkeep will be reduced to zero in a few rounds.',
      params: {
        placement: 'bottom'
      }
    },
    {
      // Phase.vue
      target: '#v-step-7',
      content: 'The current phase of the round and timer are displayed here. Each phase allots'
               + 'players 5 minutes to do what they need to do. The timer starts to count down'
               + 'as soon as a phase starts.',
      params: {
        placement: 'bottom'
      }
    },
    {
      // ContainerPhase.vue > <CardEvent /> (2)
      target: '#v-step-8',
      content: 'At the beginning of each round, a card event(s) will populate this area. You can'
               + 'view card events in detail by clicking on them directly.',
      params: {
        placement: 'left'
      }
    },
    {
      // ContainerBottom.vue
      target: '#v-step-9',
      content: 'This window contains your time blocks, accomplishments and influences that you can'
               + 'purchase.',
      params: {
        placement: 'top'
      }
    },
    {
      // ContainerInvestments.vue > <StatusBar />
      target: '#v-step-10',
      content: 'You receive 10 timeblocks per round to invest upkeep or influence.',
      params: {
        placement: 'right'
      }
    },
    {
      // ContainerInvestments.vue > <StatusBar />
      target: '#v-step-11',
      content: 'You have the option of investing your timeblocks in upkeep to maintain the shared'
               + 'infrastructure.',
      params: {
        placement: 'left'
      }
    },
    {
      // CardInvestment.vue
      target: '#v-step-12',
      content: 'The cost in timeblocks for an upkeep or influence investment is displayed here.',
      params: {
        placement: 'bottom'
      }
    },
    {
      // CardInvestment.vue
      target: '#v-step-13',
      content: 'You can increment or decrement the number of time blocks to invest using these'
               + 'buttons.',
      params: {
        placement: 'bottom'
      }
    },
    {
      // ContainerInvestments.vue > <CardInvestment />
      target: '#v-step-14',
      content: 'You can also invest your timeblocks to purchase influence. Think of influence as'
               + 'a currency; you can trade influences with other players and also use them to'
               + 'purchase accomplishments.',
      params: {
        placement: 'bottom'
      }
    },
    {
      // ContainerAccomplishments.vue > <BContainer />
      target: '#v-step-15',
      content: 'These are the accomplishments you can purchase or discard per round.',
      params: {
        placement: 'bottom'
      }
    },
    {
      // ContainerAccomplishments.vue > <CardAccomplishment />
      target: '#v-step-16',
      content: 'You can purchase accomplishments by using the influences that you have and receive'
               + 'points in return.',
      params: {
        placement: 'left'
      }
    },
    // {
    //   // ContainerRight.vue > <Member />
    //   target: '#v-step-17',
    //   content: 'Your score for the game will be displayed here and updated as you purchase more'
    //            + 'accomplishments and gain more points.',
    //   params: {
    //     placement: 'left'
    //   }
    // }
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

body .in-tour {
  pointer-events: none;
}

.v-step {
  z-index: 9999;
}

.tour-active {
  position: relative;
  z-index: 999;
  box-shadow: 
    0 0 15px 5px rgba(225, 225, 225, 1),  /* inner white */
    0 0 40px 5px rgba(0, 255, 242, 0.7), /* middle blue */
    0 0 0 10000px rgba(0, 0, 0, 0.8); /* outer black */
}

.tour-active, .v-tour {
  pointer-events: auto;
}

</style>
