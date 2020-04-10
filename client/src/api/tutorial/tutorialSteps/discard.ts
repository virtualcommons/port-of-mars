import { Step, TOP, RIGHT } from "@port-of-mars/client/types/tutorial";
import { Phase } from "@port-of-mars/shared/types";

const steps: Array<Step> = [
  {
    target: `.tour-phase`,
    content:
      `The last phase in a round is the discard phase! You` +
      `can draw new Accomplishment cards to replace any card ` +
      `you don't want to keep during the next round.`,
    params: {
      placement: RIGHT
    },
    stateTransform: [
      {
        SET_LAYOUT: `tutorial`,
        SET_GAME_PHASE: Phase.discard,
        required: true
      }
    ]
  },
  {
    target: `.tour-discard-action`,
    content: `Try discarding an Accomplishment card!`,
    params: {
      placement: TOP
    },
    stateTransform: [
      {
        SET_LAYOUT: `tutorial`,
        SET_GAME_PHASE: Phase.discard,
        required: true
      }
    ]
  }
];

export default steps;
