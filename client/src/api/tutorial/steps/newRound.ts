import { Step, LEFT, TOP, RIGHT, BOTTOM } from '@port-of-mars/client/types/tutorial';
import { Phase, RESEARCHER } from "@port-of-mars/shared/types";

const steps: Array<Step> = [
  {
    target: '.tour-round',
    content: "Let's play through a round of the game",
    params: {
      placement: LEFT
    },
  },
  {
    target: '.tour-phase',
    content: 'Welcome to the New Round phase!',
    params: {
      placement: LEFT
    },
    stateTransform: [
      {
        SET_GAME_PHASE: Phase.newRound
      },
    ],
  },
  {
    target: '.tour-phase-instructions',
    content: `In this new round phase a System Health Report (SHR) is generated`,
    params: {
      placement: LEFT
    },
  },
  {
    target: '.tour-wear-tear',
    content: 'Due to wear and tear, System Health will always decrease by 25 at the beginning of each round. If your System Health reaches 0, your Port of Mars journey will end.',
    params: {
      placement: LEFT
    },
  },
];

export default steps;
