import {
  Step,
  LEFT,
  TOP,
  RIGHT,
  BOTTOM,
} from '@port-of-mars/client/types/tutorial';
import { Phase, RESEARCHER, CURATOR } from '@port-of-mars/shared/types';
import { ChatMarsLogView } from '@port-of-mars/client/types/panes.ts';

const steps: Array<Step> = [
  {
    target: '.tour-phase',
    content: `The next phase is Trade. Here, you will trade for resources that you need to purchase Accomplishments.`,
    params: {
      placement: RIGHT,
    },

    stateTransform: [
      {
        SET_PENDING_INVESTMENTS: {
          data: {
            culture: 0,
            finance: 0,
            government: 0,
            legacy: 0,
            science: 0,
            upkeep: 0,
          },
          role: RESEARCHER,
        },
      },
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
              },
            },
            to: {
              role: RESEARCHER,
              resourceAmount: {
                culture: 1,
                finance: 1,
                government: 1,
                legacy: 1,
                science: 1,
              },
            },
            status: 'Active',
            id: 'mock-trade'
          },
        },
      },
    ],
  },
  {
    target: '.tour-active-trades-list',
    content:
      `All active trades are listed here. If you receive a trade, you can accept or decline the trade. ` +
      `When you send a trade, you only have the option to cancel the request.`,
    params: {
      placement: LEFT,
    },
  },
  {
    target: '.tour-chat',
    content: `Before making trade requests, you should talk about your plans in chat!`,
    params: {
      placement: LEFT,
    },
    stateTransform: [
      { SET_CHATMARSLOG_VIEW: ChatMarsLogView.Chat },
      {
        ADD_TO_CHAT: {
          message:
            'Hey Researcher, can I have 2 Science and 1 Government in exchange for 3 Culture?',
          role: 'Curator',
          dateCreated: new Date().getTime(),
          round: 0,
        },
      },
      {
        ADD_TO_CHAT: {
          message: 'Sure, let me make that trade right now!',
          role: 'Researcher',
          dateCreated: new Date().getTime(),
          round: 0,
        },
      },
    ],
  },
  {
    target: '.tour-request-trade',
    content: `To initiate a trade request with another player, click on the Request Trade button.`,
    params: {
      placement: TOP,
    },
    stateTransform: [
      {
        required: true,
      },
    ],
  },
  {
    target: '.tour-request-trade-partner',
    content: `First, select a player to trade with. Try clicking the curator!`,
    params: {
      placement: TOP,
    },
    stateTransform: [
      {
        required: true,
        SET_MODAL_VISIBLE: {
          type: 'TradeRequestModal',
          data: {},
        },
        validationObject: {
          name: 'Curator',
        },
      },
    ],
  },
  {
    target: '.tour-request-resources',
    content: `Next, you choose the amount of any resource that you want. Ask for 3 culture!`,
    params: {
      placement: TOP,
    },
    stateTransform: [
      {
        required: true,
        validationObject: {
          culture: 3,
          finance: 0,
          government: 0,
          legacy: 0,
          science: 0,
        },
      },
    ],
  },
  {
    target: '.tour-offer-resources',
    content:
      `Finally, select the amount of each resource you are willing to give up. You cannot send more ` +
      `resources than you currently have. Increment Science to 2 and Government to 1!`,
    params: {
      placement: TOP,
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
        },
      },
      {
        SET_GET_RESOURCES: {
          culture: 3,
          finance: 0,
          government: 0,
          legacy: 0,
          science: 0,
        },
      },
      {
        SET_TRADE_PARTNER_NAME: 'Curator',
      },
    ],
  },
  {
    target: '.tour-send-trade',
    content: `Hit send to see your trade in action!`,
    params: {
      placement: 'bottom',
    },
    stateTransform: [
      {
        required: true,
      },
      {
        SET_GET_RESOURCES: {
          culture: 3,
          finance: 0,
          government: 0,
          legacy: 0,
          science: 0,
        },
      },
    ],
  },
  {
    target: '.tour-trade-list',
    content: 'Quiz Question',
    params: {
      placement: RIGHT,
      tutorialElementId: 'trade',
    },
    stateTransform: [
      {
        SET_MODAL_HIDDEN: 'hide',
      },
    ],
  },
  {
    target: '.tour-ready-to-advance-button',
    content: `Click the Ready to Advance button when you have finished trading. `,
    params: {
      placement: LEFT,
    },
    stateTransform: [
      {
        SET_LAYOUT: 'tutorial',
        required: true,
      },
    ],
  },
];

export default steps;
