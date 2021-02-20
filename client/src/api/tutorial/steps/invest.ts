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
    target: '.tour-time-blocks',
    content:
      `In each round you will have 10 time blocks to spend in the Investment Phase unless otherwise instructed.
      You can invest these time blocks to increase System Health or to earn Influence Resources.
      You have 5 minutes to decide how to invest your time blocks. If you don't make your decision by then, you invest 0 time blocks.`,
    params: {
      placement: BOTTOM,
    },
  },
  {
    target: '.tour-invest',
    content: `Your available time blocks reset each round and are not saved across subsequent rounds. You should invest all of your time blocks each round.`,
    params: {
      placement: RIGHT,
    },
  },
  {
    target: '.tour-invest',
    content:
      `Each Influence Resource costs a certain number of time blocks, shown on the bottom right corner next to the clock icon.
      Use the '+' and '-' buttons next to System Health and each Influence Resource to change your allocation.`,
    params: {
      placement: RIGHT,
    },
  },
  {
    target: '.tour-invest-action',
    content: `At the moment, 1 point of System Health costs 1 time block so if you invest 2 time blocks in System Health,
    your personal contribution to System Health is 2. If everyone in your group invests 2 time blocks in System Health this 
    round, your Group Contributions to System Health would be 10.`,
    params: {
      placement: TOP,
    },
  },
  {
    target: '.tour-invest-action',
    content: `Let's allocate our time blocks. Please purchase 1 Science Influence which will costs 2 time blocks, shown on the bottom right.`,
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
    content: `2 time blocks have been removed from your Time Blocks meter and you have 8 remaining time blocks to invest.`,
    params: {
      placement: TOP,
    },
  },
  {
    target: '.tour-invest-action',
    content: `Time blocks aren't saved across rounds, so we should finish investing our time blocks.
      Please purchase 1 Legacy, 1 Government, and 2 System Health.`,
    params: {
      placement: TOP,
    },
    stateTransform: [
      {
        required: true,
        validationObject: {
          science: 1,
          government: 1,
          legacy: 1,
          culture: 0,
          finance: 0,
          systemHealth: 2,
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
      `Some Influence Resources can't be earned on your own. In our case, the Researcher can't earn 
      Culture or Finance Resources. However, we may need these resources to purchase certain Accomplishments.`,
    params: {
      placement: RIGHT,
    },
  },
  {
    target: '.tour-accomplishments',
    content: `Purchasing Accomplishments are how you earn points and establish your legacy on Mars.
    You can purchase an Accomplishment during the Purchase phase. Accomplishments can cost <b>Influence 
    Resources or System Health</b>. This panel shows the Accomplishments you can purchase this round as 
    well as their costs.`,
    params: {
      placement: LEFT,
    },
  },
  {
    target: '.tour-accomplishments',
    content:
      `The <b>Interdisciplinary</b> Accomplishment to the right costs 1 Culture, 1 Finance, 1 Government, 1 Legacy, and 2 Science.
      However, the Researcher can't earn Culture or Finance by investing time blocks.
      To gain these Influence Resources we must trade with other members of our group who can earn Culture and Finance.`,
    params: {
      placement: RIGHT,
    },
  },
  {
    target: '.tour-ready-to-advance-button',
    content:
      `Click <mark>Ready to Advance</mark> when you are done investing your time blocks. 
      Like all other phases, the Investment Phase will end as soon as all members of your group have finished investing and clicked 
      <mark>Ready to Advance</mark>.`,
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
