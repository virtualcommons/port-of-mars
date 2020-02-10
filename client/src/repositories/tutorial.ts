import { Step } from '@/types/tutorial';
import { Phase, Role, RESEARCHER, CURATOR } from 'shared/types';

export class TutorialSteps {
  private role: Role;
  private tutorialStepsRaw: Array<Step>;

  constructor(role: Role) {
    this.role = role;
    this.tutorialStepsRaw = [
      {
        target: '.tour-container-upkeep',
        content: 'Quiz Question',
        params: {
          placement: 'right',
          tutorialElementId: 'gameEnd'
        }
      },
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
        content: 'Quiz Question',
        params: {
          placement: 'right',
          tutorialElementId: 'upkeep25'
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
        target: '.tour-container-upkeep',
        content: 'Quiz Question',
        params: {
          placement: 'right',
          tutorialElementId: 'upkeep65'
        }
      },
      {
        target: '.tour-container-upkeep',
        content: 'Quiz Question',
        params: {
          placement: 'right',
          tutorialElementId: 'upkeep35'
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
          ADD_TO_EVENTS: {
            id: 0,
            name: 'Changing Tides',
            effect: `Each player discards all their Accomplishment cards and draws 1 new Accomplishment card. (They still draw up to a total of three cards at the end of this round.)`,
            flavorText: `Create contingencies for your contingencies and contingencies for those contingencies. Then prepare to improvise.`,
            serverActionHandler: undefined,
            clientViewHandler: 'NO_CHANGE' as const,
            clientActionHandler: undefined,
            duration: 1
          }
        } as any
      },
      {
        target: '.tour-phase',
        content:
          'Events persisting multiple rounds or relevant to the current round ' +
          'will populate here.',
        params: {
          placement: 'left'
        }
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
          CREATE_NOTIFICATION: `Notifcations can be removed by clicking on them!`
        } as any
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
          ADD_TO_MARS_LOG: {
            preformedBy: RESEARCHER,
            category: 'Event',
            content: `This event is important!`,
            timestamp: new Date().getTime()
          }
        } as any
      },
      {
        target: '.tour-profile',
        content:
          'This is your role and score during the game. Your role determines ' +
          'the investments in influence currency you can make and the accomplishments ' +
          'that you can purchase toward the end of a round.',
        params: {
          placement: 'bottom'
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
          SET_GAME_PHASE: Phase.invest,
          SET_INVESTMENT_COSTS: {
            data: {
              culture: 1001,
              finance: 1001,
              government: 3,
              legacy: 3,
              science: 2,
              upkeep: 1
            },
            role: this.role
          }
        } as any
      },
      {
        target: '.tour-investments',
        content:
          'You are allocated 10 timeblocks (unless something says otherwise) to ' +
          'spend each round. You can spend timeblocks on Upkeep or on ' +
          'Influence. Remember that you have 5 minutes to invest your timeblocks.',
        params: {
          placement: 'top'
        }
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
        }
      },
      // gamedashboard > containers > ContainerInvestments.vue
      {
        target: '.tour-investments',
        content:
          'You can also use your timeblocks to keep your habitat from collapsing by ' +
          'investing your timeblocks in Upkeep.',
        params: {
          placement: 'right'
        }
      },
      {
        target: '.tour-investments',
        content: 'Quiz Question',
        params: {
          placement: 'right',
          tutorialElementId: 'timeblocks'
        }
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
        }
      },
      {
        target: '.tour-donebtn',
        content:
          'You can hit the Done button to surrender your time if you have finished investing ' +
          'your timeblocks before the 5 minutes for the Investment Phase is up.',
        params: {
          placement: 'right'
        }
      },
      {
        target: '.tour-profile-investments',
        content:
          'After you finish investing your timeblocks, your inventory will update here.',
        params: {
          placement: 'right'
        }
      },
      {
        target: '.tour-chat',
        content:
          'During gameplay, you can communicate with other players in your habitat ' +
          'to plan and strategize.',
        params: {
          placement: 'left'
        },
        stateTransform: {
          ADD_TO_CHAT: {
            message: 'Welcome to the port of mars!',
            role: CURATOR,
            dateCreated: new Date().getTime(),
            round: 0
          }
        } as any
      },
      {
        target: '.tour-chat',
        content: 'Quiz Question',
        params: {
          placement: 'right',
          tutorialElementId: 'chat'
        }
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
              science: 5
            },
            role: this.role
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
                  science: 1
                }
              },
              to: {
                role: this.role,
                resourceAmount: {
                  culture: 1,
                  finance: 1,
                  government: 1,
                  legacy: 1,
                  science: 1
                }
              }
            }
          }
        } as any
      },
      {
        target: '.tour-round',
        content: 'Quiz Question',
        params: {
          placement: 'right',
          tutorialElementId: 'accCardInfluence'
        }
      },
      {
        target: '.tour-round',
        content: 'Quiz Question',
        params: {
          placement: 'right',
          tutorialElementId: 'accCardUpkeep'
        }
      },
      {
        target: '.tour-trade',
        content: 'Quiz Question',
        params: {
          placement: 'right',
          tutorialElementId: 'trade'
        }
      }
    ];
  }

  get steps(): Array<Step> {
    const mapped = this.tutorialStepsRaw.map(step => {
      return {
        target: step.target,
        content: step.content,
        params: {
          placement: step.params.placement,
          tutorialElementId: step.params.tutorialElementId
        },
        stateTransform: step.stateTransform
      };
    });
    return mapped;
  }
}
