import { Step } from "@port-of-mars/client/types/tutorial";
import { RESEARCHER } from "@port-of-mars/shared/types";

const steps: Array<Step> = [
  {
    target: ".tour-log",
    content: `Find more information about past Events, Accomplishment purchases, or Trades
             in the Mars Log.`,
    params: {
      placement: "top"
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
          role: RESEARCHER
        }
      }
    ]
  }
];

export default steps;
