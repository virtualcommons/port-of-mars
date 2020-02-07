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
                  v-if="!tour.isLast"
                  @click="tour.nextStep"
                  class="btn btn-dark"
                >
                  Next
                </button>
                <button
                  v-else-if="tour.isLast"
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
                  v-if="quizQuestionStatus && !tour.isLast"
                  @click="tour.nextStep"
                  class="btn btn-dark"
                  type="button"
                  name="button"
                >
                  Next
                </button>
                <button
                  v-if="quizQuestionStatus && tour.isLast"
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
import {CURATOR, Phase, QuizQuestionData, RESEARCHER} from 'shared/types';
import * as _ from 'lodash';

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
      stateTransform: {
        SET_GAME_PHASE: Phase.events,
        ADD_TO_EVENTS:{
          id: 0,
          name: 'Changing Tides',
          effect: `Each player discards all their Accomplishment cards and draws 1 new Accomplishment card. (They still draw up to a total of three cards at the end of this round.)`,
          flavorText: `Create contingencies for your contingencies and contingencies for those contingencies. Then prepare to improvise.`,
          serverActionHandler: undefined,
          clientViewHandler: 'NO_CHANGE' as const,
          clientActionHandler: undefined,
          duration: 1},
      },
    },
    {
      target: '.tour-phase',
      content:
        'Events persisting multiple rounds or relevant to the current round ' +
        'will populate here.',
      params: {
        placement: 'left'
      },


    },
    {
      target: '.tour-notification',
      content:
        'You will be notifed about events and changes in Upkeep via notifications ' +
        'that pop up here. Hover over then notification to close it.',
      params: {
        placement: 'bottom'
      },
      stateTransform: {
        CREATE_NOTIFICATION:`Notifcations can be removed by clicking on them!`,
      },
    },
    {
      target: '.tour-marslog',
      content:
        'Any events and changes in upkeep that occur will be recorded in the Mars Log ' +
        'for your reference.',
      params: {
        placement: 'right'
      },

      stateTransform: {
        ADD_TO_MARS_LOG:{
          performedBy: RESEARCHER,
          category:'Event',
          content: `This event is important!`,
          timestamp:new Date().getTime(),
        },
      },
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
      stateTransform: {
        CLEAR_NOTIFICATION:1,
      }

    },
    {
      target: '.tour-investments',
      content:
        'During the Investment phase, you may invest your timeblocks into ' +
        'Upkeep or purchase Influence currency.',
      params: {
        placement: 'right'
      },

      stateTransform: {
        SET_GAME_PHASE:Phase.invest,
        SET_INVESTMENT_COSTS:{data:{
          culture: 1001,
          finance: 1001,
          government: 3,
          legacy: 3,
          science: 2,
          upkeep: 1
        }, role: this.$store.getters.player.role},

      },
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

    },
    {
      target: '.tour-donebtn',
      content:
        'You can hit the Done button to surrender your time if you have finished investing ' +
        'your timeblocks before the 5 minutes for the Investment Phase is up.',
      params: {
        placement: 'right'
      },

    },
    {
      target: '.tour-profile-investments',
      content: 'After you finish investing your timeblocks, your inventory will update here.',
      params: {
        placement: 'right'
      },

    },
    {
      target: '.tour-chat',
      content:
        'During gameplay, you can communicate with other players in your habitat ' +
        'to plan and strategize.',
      params: {
        placement: 'left'
      },
      stateTransform:{
        ADD_TO_CHAT:{
            message:'Welcome to the port of mars!',
            role: CURATOR,
            dateCreated:new Date().getTime(),
            round:0,
        }
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

      stateTransform: {
        SET_GAME_PHASE: Phase.trade,
        SET_INVENTORY: {
          data: {
            culture: 0,
            finance: 5,
            government: 5,
            legacy: 0,
            science: 5,
            upkeep: 0,
          },
          role: this.$store.getters.player.role,
        },
        ADD_TO_TRADES: {
          id: 'mock-trade',
          trade: {
            from: {
              role: CURATOR,
              resourceAmount: {
                culture: 1,
                finance: 1,
                government: 1,
                legacy: 1,
                science: 1,
              }
            },
            to: {
              role: this.$store.getters.player.role,
              resourceAmount: {
                culture: 1,
                finance: 1,
                government: 1,
                legacy: 1,
                science: 1,
              }
            }
          }
        }
      },
    }
  ];


  private dataFetched: boolean = false;
  private quizQuestions: Array<QuizQuestionData> = [];
  private currentQuizQuestionId: number = -1;

  // TODO: Need to reset
  private currentQuizQuestionSelection: number = -1;
  private quizQuestionStatusMessage: string = '';
  private quizQuestionStatus: boolean = false;

  // NOTE: Lifecyle Hooks

  created() {
    this.api.connect(this.$store);
    this.steps = new TutorialSteps(this.playerRole).steps;
    // console.log(this.steps);
  }

  async mounted() {
    this.dataFetched = await this.getQuizQuestions();
    console.log('DATA FETCHED (true/false): ', this.dataFetched);
    if (this.dataFetched) {
      this.showModal();
    } else {
      // TODO: Handle server error
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

    // TODO: NAVIGATE TO QUIZ
    console.log('TOUR FINISHED, NAVIGATE TO QUIZ');
    this.navigateToQuiz();
  }

  // NOTE: Integrate Quiz

  private isQuizQuestion(currentStep: number): boolean {
    console.log('CURRENT STEP: ', currentStep);
    console.log('CURRENT STEP: ', this.steps[currentStep]);
    if (this.steps[currentStep].params.quizQuestionId !== undefined) {
      this.currentQuizQuestionId = this.steps[
        currentStep
      ].params.quizQuestionId!;
      console.log('QUIZ QUESTION ID: ', this.currentQuizQuestionId);
      return true;
    }
    console.log('NOT A QUIZ QUESTION');
    return false;
  }

  get currentQuizQuestion() {
    const index = _.findIndex(this.quizQuestions, [
      'id',
      this.currentQuizQuestionId
    ]);
    return this.quizQuestions[index];
  }

  private handleQuizQuestionSelection(index: number): void {
    this.currentQuizQuestionSelection = index;
    console.log('CURRENT SELECTION: ', this.currentQuizQuestionSelection);
  }

  async handleCheckQuizQuestion() {
    const result = await this.checkQuizQuestion(
      this.currentQuizQuestionId,
      this.currentQuizQuestionSelection
    );
    if (result) {
      this.quizQuestionStatusMessage = 'Correct! Please click next.';
      this.quizQuestionStatus = true;
    } else {
      this.quizQuestionStatusMessage = 'Incorrect, please try again.';
    }
    console.log(this.quizQuestionStatusMessage);
  }

  private selectionStyle(index: number) {
    if (index === this.currentQuizQuestionSelection) {
      return { backgroundColor: 'var(--new-space-orange)' };
    }
    return {};
  }

  private async navigateToQuiz() {
    // this.$router.push({ name: 'TutorialQuiz' });
  }

  private async getQuizQuestions(): Promise<boolean> {
    const quizUrl = `${process.env.SERVER_URL_HTTP}/quiz`;
    const data: any = { username: 'bob' };
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      return false;
    }
    const response = await fetch(quizUrl, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    if (response.status === 200) {
      const data: Array<QuizQuestionData> = await response.json();
      this.quizQuestions = data;
      return true;
    } else {
      const error = await response.json();
      this.notifyUserOfError(error);
    }
    return false;
  }

  private async checkQuizQuestion(
    id: number,
    optionSubmitted: number
  ): Promise<boolean> {
    const quizUrl = `${process.env.SERVER_URL_HTTP}/quiz/${id}/${optionSubmitted}`;
    const response = await fetch(quizUrl, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer'
    });
    if (response.status === 200) {
      const data = await response.json();
      return data;
    } else {
      const error = await response.json();
      this.notifyUserOfError(error);
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
