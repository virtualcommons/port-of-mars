import {BOTTOM, LEFT, RIGHT, Step} from '@port-of-mars/client/types/tutorial';
import {ChatMarsLogView, HUDLeftView,} from '@port-of-mars/shared/game/client/panes';
import {RESEARCHER} from "@port-of-mars/shared/types";

const
  steps: Array<Step> = [
    {
      target: '.tour-player-self',
      content:
        `This is your role and score. Each role has a unique set of Resources that ` +
        `they can invest time blocks in and Accomplishments that they can purchase.`,
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
      content: `You can access different views by clicking these buttons: Other Players, Inventory, and Available Accomplishments.`,
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
      content: `There are 5 roles in the Port of Mars: the Curator, Entrepreneur, Pioneer, Politician, and Researcher.`,
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
      target: '.tour-hud-left-toggle',
      content: `In the Inventory menu, you can view the Resources that you own and their costs.`,
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
      content: `In the Accomplishments menu, you can view the Accomplishments that are available to buy this round.`,
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
      target: '.tour-inventory-view',
      content:
        `You can see the Influence Resources you own here, earned from investing time blocks, trading, ` +
        `or Events`,
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
