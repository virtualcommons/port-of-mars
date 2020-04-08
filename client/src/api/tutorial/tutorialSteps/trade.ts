import {Step, LEFT, TOP} from "@port-of-mars/client/types/tutorial";
import {Phase, RESEARCHER, CURATOR} from "@port-of-mars/shared/types";

const steps: Array<Step> = [
  {
    target: '.tour-trade',
    content:
      `The next phase is the Trading Phase! Here you will trade for resources that you need to purchase Accomplishment cards!`,
    params: {
      placement: LEFT,
    },

    stateTransform: [
      {
        SET_GAME_PHASE: Phase.trade,
      },
      {
        SET_INVENTORY: {
          data: {
            culture: 0,
            finance: 5,
            government: 5,
            legacy: 0,
            science: 5,
            upkeep: 0,
          },
          role: RESEARCHER,
        },
      },
      {
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
              role: RESEARCHER,
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
      }
    ],
  },
  {
    target: '.tour-trade-item',
    content: `All active trades are listed here. If you are on the receiving end of a trade, you will have the option to either
      accept or decline the trade.
      If you are the sender of a trade, you only have the option to cancel the request.`,
    params: {
      placement: 'top',
    }
  },
  {
    target: '.tour-chat',
    content: `Before making trade requests, you should talk about your plans in chat!`,
    params: {
      placement: 'left'
    },
    stateTransform: [
      {
        ADD_TO_CHAT: {
          message: 'Hey Researcher, can I have 2 Science and 1 Government in exchange for 3 Culture?',
          role: `Curator`,
          dateCreated: new Date().getTime(),
          round: 0,
        }
      },
      {
        ADD_TO_CHAT: {
          message: 'Sure, let me make that trade right now!',
          role: `Researcher`,
          dateCreated: new Date().getTime(),
          round: 0,
        }
      },
    ],
  },
  {
    target: '.tour-request-trade',
    content: `To initiate a trade request with another player, click on the Request Trade button.`,
    params: {
      placement: 'top',
    },
    stateTransform: [
      {
        // required: true,
        SET_LAYOUT: 'tutorial',
        SET_TRADE_REQUEST_MODAL_VISIBILITY: true,
        // validationObject: {
        //   visible: true,
        // }
      },
    ]
  },
  {
    target: '.tour-request-trade-partner',
    content: `To request a trade, you must first select a person to trade with. Try clicking the curator!`,
    params: {
      placement: 'top'
    },
    stateTransform: [
      {
        required: true,
        validationObject: {
          name: 'Curator',
        }
      }
    ]
  },
  {
    target: '.tour-offer-resources',
    content: `Then, you select the amount of each resource you are willing to give up.
      You cannot send more resources than you currently have. Increment Science to 2 and Government to 1!`,
    params: {
      placement: 'top',
    },
    stateTransform: [
      {
        required: true,
        validationObject: {
          culture: 0,
          finance: 0,
          government: 1,
          legacy: 0,
          science: 2,
        }
      },
      {
        SET_TRADE_PARTNER_NAME:'Curator',
      }
    ]
  },
  {
    target: '.tour-request-resources',
    content: `Finally, you choose how much of any resource that you want. Ask for 3 culture!`,
    params: {
      placement: 'top',
    },
    stateTransform: [
      {
        required: true,
        validationObject:{
          culture: 3,
          finance: 0,
          government: 0,
          legacy: 0,
          science: 0,
        }
      },
      {
        SET_SEND_RESOURCES:{
            culture: 0,
            finance: 0,
            government: 1,
            legacy: 0,
            science: 2,
        }
      }
    ],
  },
  {
    target: '.tour-send-trade',
    content: `Hit send to see your trade in action!`,
    params: {
      placement: LEFT
    },
    stateTransform: [
      {
        required: true,
      },
      {
        SET_GET_RESOURCES:{
            culture: 3,
            finance: 0,
            government: 0,
            legacy: 0,
            science: 0,
        },
      }

    ],
  },
  {
    target: '.tour-trade',
    content: 'Quiz Question',
    params: {
      placement: TOP,
      tutorialElementId: 'trade'
    },
    stateTransform: [
      {
        required: false,
      },

      {
        SET_TRADE_REQUEST_MODAL_VISIBILITY: false,
      }

    ],
  }

]

export default steps;
