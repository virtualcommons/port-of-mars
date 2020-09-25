import { Step, RIGHT, LEFT, TOP } from '@port-of-mars/client/types/tutorial';
import {
  ChatMarsLogView,
  HUDLeftView,
} from '@port-of-mars/shared/game/client/panes';

const
  steps: Array<Step> = [
  {
    target: '.tour-profile',
    content: `There are 5 roles in the Port of Mars: the Curator, Entrepeneur, Pioneer, Politician, and Researcher.`,
    params: {
      placement: RIGHT,
    },
  },
  {
    target: '.tour-player-self',
    content:
      `This is your role and score. Each role has a unique set of Resources that ` +
      `they can invest time blocks in and Accomplishments that they can purchase. ` +
      `Click on your role's icon to reveal more information about your role.`,
    params: {
      placement: RIGHT,
    },
    stateTransform: [
      {
        required: true,
      },
    ],
  },
  {
    target: '.tour-player-info-modal',
    content: `This menu displays your player's information including your available and purchased Accomplishments and the Influence Resources you have earned.`,
    params: {
      placement: RIGHT,
    },
    stateTransform: [
      {
        SET_MODAL_VISIBLE: {
          type: 'PlayerModal',
          data: { role: 'Researcher' },
        },
      },
    ],
  },
  {
    target: '.tour-player-info-modal-stats',
    content:
      `Your player stats include your role, current score in the ` +
      `game, and how your score compares with the other members of your group.`,
    params: {
      placement: 'top',
    },
  },
  {
    target: '.tour-player-info-modal-inventory',
    content: `Your Inventory displays how many Influence Resources you currently own.`,
    params: {
      placement: LEFT,
    },
  },
  {
    target: '.tour-player-info-modal-accomplishments',
    content: `Here you can find the Accomplishments you have available to purchase and any already purchased Accomplishments. 
    At the beginning of each round you will draw up to three new Accomplishment cards to replace any you may have Purchased 
    or Discarded. We will cover Accomplishments in more detail in the Investment and Purchase phases.`,
    params: {
      placement: RIGHT,
    },
  },
  {
    target: '.tour-players',
    content:
      `These are the other four residents at the Port of Mars. Certain Events will ` +
      `allow you to view their inventories as well.`,
    params: {
      placement: RIGHT,
    },
    stateTransform: [
      {
        SET_PROFILE_MENU_VISIBILITY: false,
        SET_MODAL_HIDDEN: true,
      },
    ],
  },
  {
    target: '.tour-inventory-view',
    content:
      `You can see the Influence Resources you own here, earned from investing time blocks, trading, ` +
      `or even the occasional Event`,
    params: {
      placement: 'right',
    },
    stateTransform: [
      {
        SET_HUDLEFT_VIEW: HUDLeftView.Inventory,
      },
    ],
  },
  {
    target: '.tour-log-view',
    content:
      `This is the Mars Log, a history of what has transpired at the Port of Mars thus far. 
      You can find more information about any past Events, Accomplishment purchases, or Trades here.`,
    params: {
      placement: 'left',
    },
    stateTransform: [
      {
        SET_CHATMARSLOG_VIEW: ChatMarsLogView.MarsLog,
      },
    ],
  },
];

export default steps;