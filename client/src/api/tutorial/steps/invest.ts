import {
  Step,
  TOP,
  RIGHT,
  BOTTOM,
  LEFT,
} from '@port-of-mars/client/types/tutorial';
import { Phase, RESEARCHER } from '@port-of-mars/shared/types';

const steps: Array<Step> = [
  {
    target: '.tour-phase',
    content: `The second phase is Investment.`,
    params: {
      placement: RIGHT,
    },
    stateTransform: [
      {
        SET_GAME_PHASE: Phase.invest,
        SET_INVESTMENT_COSTS: {
          data: {
            culture: Number.MAX_SAFE_INTEGER,
            finance: Number.MAX_SAFE_INTEGER,
            government: 3,
            legacy: 3,
            science: 2,
            upkeep: 1
          },
          role: RESEARCHER,
        },
      },
    ],
  },
  {
    target: '.tour-accomplishments',
    content: `Here, you can see what Accomplishments are available to you during a round.`,
    params: {
      placement: RIGHT,
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
            upkeep: 0,
            victoryPoints: 5,
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
            upkeep: 0,
            victoryPoints: 3,
            effect: '',
          },
          role: `Researcher`,
        },
      },
    ],
  },
  {
    target: '.tour-time-blocks',
    content:
      `You have 10 time blocks to spend each round unless otherwise instructed. ` +
      `You can spend these time blocks on System Health or Resources. ` +
      `Remember: you have 5 minutes to decide how to invest your time blocks.`,
    params: {
      placement: BOTTOM,
    },
  },
  {
    target: '.tour-invest',
    content: `You cannot recycle time blocks between rounds so you should spend all of
    them in each round.`,
    params: {
      placement: RIGHT,
    },
  },
  {
    target: '.tour-invest',
    content:
      `The time block cost is located at the bottom right corner of a Resource. ` +
      `On the Resource, there are two buttons: '+' and '-'. Press '+' to invest ` +
      `your available time blocks into a Resource. If you choose to reallocate your  ` +
      `time blocks, press '-' to reduce your time block investment from a Resource.`,
    params: {
      placement: RIGHT,
    },
  },
  {
    target: '.tour-invest-action',
    content: `Try it out: purchase 1 science. Note the '2' near the clock! That is the
    cost of this resource.`,
    params: {
      placement: TOP,
    },
    stateTransform: [
      {
        required: true,
        validationObject: {
          science: 1,
          government: 0,
          legacy: 0,
          culture: 0,
          finance: 0,
          upkeep: 0,
        },
      },
    ],
  },
  {
    target: '.tour-time-blocks',
    content: `As you can see, 2 time blocks have been removed!`,
    params: {
      placement: TOP,
    },
  },
  {
    target: '.tour-invest-action',
    content: `Time blocks cannot be recycled, so finish spending!
      You should buy 1 more science and 2 government!`,
    params: {
      placement: TOP,
    },
    stateTransform: [
      {
        required: true,
        validationObject: {
          science: 2,
          government: 2,
          legacy: 0,
          culture: 0,
          finance: 0,
          upkeep: 0,
        },
      },
    ],
  },
  {
    target: '.tour-invest-action',
    content: 'Quiz Question',
    params: {
      placement: RIGHT,
      tutorialElementId: 'timeblocks',
    },
  },
  {
    target: '.tour-invest',
    content:
      `There are some Resources that you cannot earn on your own. For example, ` +
      `the Researcher cannot earn Culture or Finance Resources by investing their time blocks. ` +
      `However, you may need these resources to purchase certain Accomplishments.`,
    params: {
      placement: RIGHT,
    },
  },
  {
    target: '.tour-accomplishments',
    content:
      `For example, this Accomplishment requires 1 Culture, which you cannot earn. ` +
      `To get this Resource, you must trade with someone who has 1 Culture.`,
    params: {
      placement: RIGHT,
    },
  },
  {
    target: '.tour-ready-to-advance-button',
    content:
      `Click Ready to Advance when you have finished investing your time blocks. ` +
      `The Investment Phase ends as soon as all members of your habitat have finished investing.`,
    params: {
      placement: BOTTOM,
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
