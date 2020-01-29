import {Phase} from "shared/types";
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
                <button v-if="!tour.isLast" @click="tour.nextStep" class="btn btn-dark">
                  Next
                </button>
                <button v-else-if="tour.isLast" @click="tour.stop" class="btn btn-dark">
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
import {GameRequestAPI} from '@/api/game/request';
import GameDashboard from "@/components/GameDashboard.vue";
import {initialStoreState, State} from "@/store/state";
import _ from "lodash";
import {Phase} from "shared/types";
import {Step} from "@/types/tutorial";

require('vue-tour/dist/vue-tour.css');
Vue.use(VueTour);

const setPhase = (phase: Phase) => (s: State) => {
    s.phase = phase;
    return s;
};

@Component({
  name: 'tutorial',
  components: {
    GameDashboard,
    TourModal
  }
})
export default class Tutorial extends Vue {
  @Provide()
  api = new GameRequestAPI();

  hasApi = false;

  async created() {
    this.setupRoom();
  }

  setupRoom() {
    this.api.connect({
      send(data: any) {},
      leave() {}
    });
    this.replaceState(s => s);
    this.hasApi = true;
  }

  destroyed() {
    this.api.room.leave();
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
  steps: Array<Step> = [
    {
      target: '.tour-container-upkeep',
      content:
        'The game starts with Upkeep at 100. This represents the habitat at peak ' +
        'condition and maintenance. However, at the start of every round, the ' +
        'community loses 25 Upkeep.',
      params: {
        placement: 'bottom'
      }
    },
    {
      target: '.tour-container-upkeep',
      content:
        'At the start of a round, if Upkeep is lower than 65, reveal 2 events; ' +
        'and if Upkeep is lower than 35 reveal 3 events. Conditions on Mars ' +
        'are tough!',
      params: {
        placement: 'bottom'
      }
    },
    {
      target: '.tour-round',
      content:
        'The game progresses in rounds. There is an indefinite number ' +
        'of rounds per game. Therefore, the game can end at any time given ' +
        'that Upkeep does not decline to zero.',
      params: {
        placement: 'right'
      }
    },
    {
      target: '.tour-container-top',
      content:
        'There are multiple phases in a round: Events, Invest, Trade, Purchase ' +
        ' and Discard. Each phase has a time limit of 5 minutes.',
      params: {
        placement: 'bottom'
      }
    },
    {
      target: '.tour-container-bottom',
      content:
        'Events are revealed at the beginning of every round during the events phase. ' +
        'Some events can be more involved and require players to fulfill tasks ' +
        'that include voting. Mars is unpredictable; many different events can happen!',
      params: {
        placement: 'bottom'
      },
      stateTransform: setPhase(Phase.events),
    },
    {
      target: '.tour-phase',
      content:
        'Events persisting multiple rounds or relevant to the current round ' +
        'will populate here.',
      params: {
        placement: 'left'
      },
      stateTransform: setPhase(Phase.events)
    },
    {
      target: '.tour-notification',
      content:
        'You will be notifed about events and changes in Upkeep via notifications ' +
        'that pop up here. Hover over then notification to close it.',
      params: {
        placement: 'bottom'
      },
      stateTransform: _.flow([setPhase(Phase.events), s => {
        s.activeNotifications = ['Welcome to port of mars', 'Dismiss me by clicking on me']
        return s;
      }])
    },
    {
      target: '.tour-marslog',
      content:
        'Any events and changes in upkeep that occur will be recorded in the Mars Log ' +
        'for your reference.',
      params: {
        placement: 'right'
      },
      stateTransform: setPhase(Phase.events),
    },
    {
      target: '.tour-profile',
      content:
        'This is your role and score during the game. Your role determines ' +
        'the investments in influence currency you can make and the accomplishments ' +
        'that you can purchase toward the end of a round.',
      params: {
        placement: 'bottom'
      },
      stateTransform: setPhase(Phase.events),
    },
    {
      target: '.tour-investments',
      content:
        'During the Investment phase, you may invest your timeblocks into ' +
        'Upkeep or purchase Influence currency.',
      params: {
        placement: 'right'
      },
      stateTransform: setPhase(Phase.invest),
    },
    {
      target: '.tour-investments',
      content:
        'You are allocated 10 timeblocks (unless something says otherwise) to ' +
        'spend each round. You can spend timeblocks on Upkeep or on ' +
        'Influence. Remember that you have 5 minutes to invest your timeblocks.',
      params: {
        placement: 'top'
      },
      stateTransform: setPhase(Phase.invest),
    },
    // gamedashboard > containers > ContainerInvestments.vue
    {
      target: '.tour-investments',
      content:
        'During the Investment phase, you can invest your timeblocks to obtain ' +
        'influence currency and use your influence currency inventory to trade ' +
        'with other players in the Trade phase.',
      params: {
        placement: 'right'
      },
      stateTransform: setPhase(Phase.invest),
    },
    // gamedashboard > containers > ContainerInvestments.vue
    {
      target: '.tour-investments',
      content:
        'You can also use your timeblocks to keep your habitat from collapsing by ' +
        'investing your timeblocks in Upkeep.',
      params: {
        placement: 'right'
      },
      stateTransform: setPhase(Phase.invest),
    },
    // gamedashboard > containers > ContainerInvestments.vue
    {
      target: '.tour-investments',
      content:
        'The cost of the card in timeblocks in located at the bottom right corner ' +
        'of the card. Use the increment (+) button on a card to invest your timeblocks or ' +
        'the decrement (-) button to remove timeblocks from an investment ' +
        'that you have made.',
      params: {
        placement: 'right'
      },
      stateTransform: setPhase(Phase.invest),
    },
    {
      target: '.tour-donebtn',
      content:
        'You can hit the Done button to surrender your time if you have finished investing ' +
        'your timeblocks before the 5 minutes for the Investment Phase is up.',
      params: {
        placement: 'right'
      },
      stateTransform: setPhase(Phase.invest),
    },
    {
      target: '.tour-profile-investments',
      content: 'After you finish investing your timeblocks, your inventory will update here.',
      params: {
        placement: 'right'
      },
      stateTransform: setPhase(Phase.invest),
    },
    {
      target: '.tour-chat',
      content:
        'During gameplay, you can communicate with other players in your habitat ' +
        'to plan and strategize.',
      params: {
        placement: 'left'
      },
    },
    {
      target: '.tour-players',
      content:
        'These are the other residents of Port of Mars. There are 5 roles in the game: ' +
        'Researcher, Pioneer, Curator, Entrepreneur, and Politician.',
      params: {
        placement: 'left'
      }
    },
    {
      target: '.tour-players',
      content:
        'The player score is displayed on the far left; name in the middle; ' +
        'and character art on the right.',
      params: {
        placement: 'left'
      }
    },
    // gamedashboard > containers > ContainerPhase.vue
    {
      target: '.tour-trade',
      content:
        'During the Trade Phase, you can trade influence currency with other ' +
        'players. Trading allows you to obtain other influence currencies ' +
        'that you yourself cannnot invest in so that you can purchase ' +
        'accomplishments later in the game.',
      params: {
        placement: 'right'
      },
      stateTransform: setPhase(Phase.trade)
    }
  ];

  replaceState(fn: (s: State) => State = id => id) {
    const data = _.cloneDeep(initialStoreState);
    data.marsEvents.push(    {
      id: 0,
      name: 'Changing Tides',
      effect: `Each player discards all their Accomplishment cards and draws 1 new Accomplishment card. (They still draw up to a total of three cards at the end of this round.)`,
      flavorText: `Create contingencies for your contingencies and contingencies for those contingencies. Then prepare to improvise.`,
      serverActionHandler: undefined,
      clientViewHandler: 'NO_CHANGE' as const,
      clientActionHandler: undefined,
      duration: 1
    });
    const s = fn(data);
    this.$store.replaceState(s);
  }

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
   *
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
    this.replaceState(this.steps[currentStep - 1].stateTransform || (id => id));
    await this.$nextTick();
    const currentStepElement = this.$el.querySelector(this.steps[currentStep].target);
    const previousStepElement = this.$el.querySelector(this.steps[currentStep - 1].target);
    // remove active step from current step
    currentStepElement!.classList.remove(this.TOUR_ACTIVE_CLASS);
    // add active class to previous step
    previousStepElement!.classList.add(this.TOUR_ACTIVE_CLASS);
  }
  async nextStepCallback(currentStep: number) {
    this.replaceState(this.steps[currentStep + 1].stateTransform || (id => id));
    await this.$nextTick();
    const currentStepElement = this.$el.querySelector(this.steps[currentStep].target);
    const nextStepElement = this.$el.querySelector(this.steps[currentStep + 1].target);
    // remove active step from current step
    currentStepElement!.classList.remove(this.TOUR_ACTIVE_CLASS);
    // add active step to next step
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
