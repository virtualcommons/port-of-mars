import {BOTTOM, LEFT, RIGHT, Step} from '@port-of-mars/client/types/tutorial';
import {ChatMarsLogView, HUDLeftView,} from '@port-of-mars/shared/game/client/panes';
import {RESEARCHER} from "@port-of-mars/shared/types";

const
  steps: Array<Step> = [
    {
      target: '.tour-player-self',
      content:
        `There are 5 roles in the Port of Mars: the Curator, Entrepreneur, Pioneer, Politician, and Researcher.
         In this tutorial you are the <b>Researcher</b>. Each role has a unique set of Influence Resources that 
         they can earn and Accomplishments that they can purchase.`,
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
        }
      ]
    },
    {
      target: '.tour-hud-left-toggle',
      content: `You can view different information by clicking the icons above: Other Players, Inventory, and Available Accomplishments.`,
      params: {
        placement: BOTTOM
      },
      stateTransform: [
        {
          SET_ACTIVE_ACCOMPLISHMENTS: {
            data: {
              id: 1,
              role: 'Researcher',
              label: 'Interdisciplinary',
              flavorText:
                'You have more PhDs than most people have common sense.',
              science: 2,
              government: 1,
              legacy: 1,
              finance: 1,
              culture: 1,
              systemHealth: 0,
              victoryPoints: 5,
              effect: '',
            },
            role: `Researcher`,
          },
        }
      ]
    },
    {
      target: '.tour-hud-left-toggle',
      content: `The Other Players screen displays your group's roles and scores. 
      `,
      params: {
        placement: RIGHT,
      },
      stateTransform: [
        {
          SET_HUDLEFT_VIEW: HUDLeftView.OtherPlayers
        },
        {
          SET_ACTIVE_ACCOMPLISHMENTS: {
            data: {
              id: 7,
              role: 'Researcher',
              label: 'Radiation Shielding',
              flavorText:
                'You discover a material that is more effective at shielding the habitats from radiation.',
              science: 1,
              government: 0,
              legacy: 0,
              finance: 4,
              culture: 0,
              systemHealth: 0,
              victoryPoints: 4,
              effect: '',
            },
            role: `Researcher`,
          },
          PURCHASE_ACCOMPLISHMENT: {
            data: {
              id: 2,
              role: 'Researcher',
              label: 'Mars Helicopter',
              flavorText:
                'Your invention of a low gravity, low atmosphere, low-flying vehicle enables ' +
                'greater exploration of the Martian surface.',
              science: 2,
              government: 0,
              legacy: 0,
              finance: 1,
              culture: 1,
              systemHealth: 0,
              victoryPoints: 3,
              effect: '',
            },
            role: `Researcher`,
          },
        },
      ]
    },
    {
      target: '.tour-inventory-view',
      content: `The Inventory screen displays the Influence Resources that you own and their investment costs. 
      You can earn Influence Resources by investing time blocks, trading, or certain Events.`,
      params: {
        placement: RIGHT,
      },
      stateTransform: [
        {
          SET_HUDLEFT_VIEW: HUDLeftView.Inventory,
        },
      ]
    },
    {
      target: '.tour-hud-left-toggle',
      content: `These are the Accomplishments you can buy in the Purchase phase of this round 
      <b>if you can afford them</b>. Different Accomplishments have different costs in Influence
      Resources or System Health.`,
      params: {
        placement: RIGHT,
      },
      stateTransform: [
        {
          SET_HUDLEFT_VIEW: HUDLeftView.Accomplishments
        }
      ]
    },
    {
      target: '.tour-player-self',
      content:
        `Click on your large role icon to reveal more information about your role and continue with the tutorial.`,
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
      content: `This screen shows your score, available and purchased Accomplishments and the Influence Resources you have earned.`,
      params: {
        placement: RIGHT,
      },
      stateTransform: [
        {
          SET_MODAL_VISIBLE: {
            type: 'PlayerModal',
            data: {role: 'Researcher'},
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
      content: `The Accomplishments that you can purchase or have already purchased are displayed here. You can have up to 
      <b>three Accomplishments</b> available to purchase at a time. If you Purchase an Accomplishment or Discard them, you will
      receive up to the maximum of three new Accomplishments at the beginning of the next round.
      We will cover Accomplishments in more detail in the Investment and Purchase phases.`,
      params: {
        placement: RIGHT,
      },
    },
    {
      target: '.tour-players',
      content:
        `These are the other four residents at the Port of Mars. Certain Events can let you view their Inventories as well.`,
      params: {
        placement: 'RIGHT',
      },
      stateTransform: [
        {
          SET_PROFILE_MENU_VISIBILITY: false,
          SET_MODAL_HIDDEN: true,
          SET_HUDLEFT_VIEW: HUDLeftView.OtherPlayers
        },
      ],
    },
    {
      target: '.tour-log-view',
      content:
        `The Mars Log keeps track everything that has transpired at the Port of Mars thus far.
        You can find more information about past Events, Accomplishment purchases, or Trades here.`,
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
