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
    content: `The next phase is Trade where members of your group can trade Influence Resources to purchase Accomplishments.`,
    params: {
      placement: RIGHT,
    },
    stateTransform: [
      {
        SET_INVESTMENT_COSTS: {
          data: {
            culture: Number.MAX_SAFE_INTEGER,
            finance: Number.MAX_SAFE_INTEGER,
            government: 3,
            legacy: 3,
            science: 2,
            systemHealth: 1
          },
          role: RESEARCHER,
        },
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
      `Active trade requests are listed here. If you receive a trade request, you can accept or decline the trade. ` +
      `If you send a trade request, you only have the option to cancel the request.`,
    params: {
      placement: LEFT,
    },
  },
  {
    target: '.tour-trade-filters',
    content:
      `Use this toggle to view all trade requests in the Port of Mars or just Your Trades - trade requests that ` +
      `you have received or sent to others.`,
    params: {
      placement: LEFT,
    },
  },
  {
    target: '.tour-chat',
    content: `Before sending trade requests, it's often a good idea to talk about your trade plans in chat.`,
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
    content: `To initiate a trade request with another player, use the Request Trade button here. Try clicking it now.`,
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
    content: `After starting a Trade Request, you can see your available
    Accomplishments here. You can also click on Inventory to view 
    the Influence Resources you currently own.`,
    params: {
      placement: RIGHT,
    },
  },
  {
    target: '.tour-request-trade-partner',
    content: `First, select a player to trade with. Let's select the Curator.`,
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
    content: `Next, select the quantity and type of Influence Resource that you want. Let's request 3 Culture (the brown paintbrush).`,
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
      `Then select the quantity of each Influence Resource you wish to offer in trade. You cannot send more ` +
      `resources than you currently have. Let's offer 2 Science and 1 Government.`,
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
    content: `Finally, click Send Trade Request to issue your trade request to the Curator.`,
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
    target: '.tour-phase',
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
    content: `Click the Ready to Advance button when you have finished trading.`,
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
