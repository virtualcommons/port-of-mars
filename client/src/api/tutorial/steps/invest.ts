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
    content: `The third phase is Investment.`,
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
            systemHealth: 1
          },
          role: RESEARCHER,
        },
      },
    ],
  },
  {
    target: '.tour-accomplishments',
    content: `Accomplishments are how you earn points and establish your legacy on Mars.
    You can purchase an accomplishment if you have enough Influence to cover its costs.
    Here you'll be able to see what Accomplishments you can purchase this round.`,
    params: {
      placement: RIGHT,
    },
  },
  {
    target: '.tour-time-blocks',
    content:
      `In each round you will have 10 time blocks to spend unless otherwise instructed. ` +
      `You can spend these time blocks on System Health or Influence Resources. ` +
      `Remember: you have 5 minutes to decide how to invest your time blocks.`,
    params: {
      placement: BOTTOM,
    },
  },
  {
    target: '.tour-invest',
    content: `Time blocks are reset each round and do not get saved for subsequent rounds. You should allocate all of your time each round!`,
    params: {
      placement: RIGHT,
    },
  },
  {
    target: '.tour-invest',
    content:
      `Each Resource costs time blocks and you can see the cost at the bottom right corner next to the clock icon. ` +
      `Use the '+' button to invest your time blocks into a Resource. If you decide to change your  ` +
      `investment, use the '-' button to reduce your time block investment from a Resource.`,
    params: {
      placement: RIGHT,
    },
  },
  {
    target: '.tour-invest-action',
    content: `During this phase, you may invest your time blocks in System Health or other Influence Resources.
    Right now, System Health costs 1 time block so if we invest 3 time blocks in System Health, your personal contribution to your group's 
    System Health is 3. If everyone in your group invested 3 time blocks in System Health this round, your total group contribution to 
    System Health would be 15.`,
    params: {
      placement: TOP,
    },
  },
  {
    target: '.tour-invest-action',
    content: `Let's purchase 1 Science Influence. Each Science Influence costs 2 time blocks, shown on the bottom right.`,
    params: {
      placement: RIGHT,
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
          systemHealth: 0,
        },
      },
    ],
  },
  {
    target: '.tour-time-blocks',
    content: `You should notice that 2 time blocks have been removed from your Time Blocks meter and you have 8 remaining time blocks to invest.`,
    params: {
      placement: TOP,
    },
  },
  {
    target: '.tour-invest-action',
    content: `Time blocks aren't saved across rounds, so let's finish investing our time.
      Please buy 1 more Science and 2 Government Influences.`,
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
          systemHealth: 0,
        },
      },
    ],
  },
  {
    target: '.tour-phase',
    content: 'Quiz Question',
    params: {
      placement: LEFT,
      tutorialElementId: 'timeblocks',
    },
  },
  {
    target: '.tour-phase',
    content:
      `There are some Influence Resources that you cannot earn on your own. For example, ` +
      `the Researcher cannot earn Culture or Finance Resources by investing their time blocks. ` +
      `However, you may need these resources to purchase certain Accomplishments.`,
    params: {
      placement: RIGHT,
    },
  },
  {
    target: '.tour-accomplishments',
    content:
      `This Accomplishment requires 1 Culture, which you as the Researcher cannot earn by investing time blocks. ` +
      `To earn this Resource, you must trade with someone who has 1 Culture.`,
    params: {
      placement: RIGHT,
    },
  },
  {
    target: '.tour-ready-to-advance-button',
    content:
      `Click Ready to Advance when you have finished investing your time blocks. ` +
      `The Investment Phase ends as soon as all members of your group have finished investing.`,
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
