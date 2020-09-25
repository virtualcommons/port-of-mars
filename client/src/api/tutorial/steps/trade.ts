import {
  Step,
  LEFT,
  TOP,
  RIGHT,
  BOTTOM,
} from '@port-of-mars/client/types/tutorial';
import { Phase, RESEARCHER, CURATOR } from '@port-of-mars/shared/types';
import { ChatMarsLogView } from '@port-of-mars/shared/game/client/panes';

const steps: Array<Step> = [
  {
    target: '.tour-phase',
    content: `The next phase is Trade where you can trade for Influence Resources that you need to purchase Accomplishments.`,
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
            systemHealth: 0,
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
            systemHealth: 0,
          },
          role: RESEARCHER,
        },
      },
      {
        ADD_TO_TRADES: {
          id: 'mock-trade',
          trade: {
            sender: {
              role: CURATOR,
              resourceAmount: {
                culture: 1,
                finance: 1,
                government: 1,
                legacy: 1,
                science: 1,
              },
            },
            recipient: {
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
      `All active trades are listed here. If you receive a trade request, you can either accept or decline the trade. ` +
      `When you send a trade, you only have the option to cancel the request.`,
    params: {
      placement: LEFT,
    },
  },
  {
    target: '.tour-trade-filters',
    content:
      `Use this toggle switch to view all trade requests in the Port of Mars or just your trades, i.e., trade requests that ` +
      `you have received or sent to others.`,
    params: {
      placement: LEFT,
    },
  },
  {
    target: '.tour-chat',
    content: `Before making trade requests, it's usually a good idea to talk about your trade plans in chat.`,
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
    target: '.tour-request-trade-accomplishments',
    content: `Upon opening a Trade Request, you can view your available ` +
    `Accomplishments here. You can also toggle the menu to view ` +
    `your inventory of available Influence Resources.`,
    params: {
      placement: RIGHT,
    },
  },
  {
    target: '.tour-request-trade-partner',
    content: `First, you must select a player to trade with. Please click on the Curator!`,
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
    content: `Next, select the quantity and type of Influence Resource that you want. Let's request 3 culture.`,
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
      `Finally, select the quantity of each Influence Resource you wish to trade. You cannot send more ` +
      `resources than you currently have. Let's trade 2 Science and 1 Government.`,
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
    content: `Click Send Trade Request to see your trade in action!`,
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