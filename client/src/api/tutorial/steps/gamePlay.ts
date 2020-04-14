import { Step, LEFT, RIGHT, BOTTOM} from "@port-of-mars/client/types/tutorial";
import { CURATOR } from "@port-of-mars/shared/types";

const steps: Array<Step> = [
  {
    target: ".tour-round",
    content: `The game progresses in rounds. The number of rounds changes from game to game, so the game could
        end at any time.`,
    params: {
      placement: LEFT
    }
  },
  {
    target: ".tour-phase-time",
    content:
      `There are multiple phases in a round: Events, Invest, Trade, Purchase ` +
      ` and Discard. Each phase has a time limit of 5 minutes.`,
    params: {
      placement: LEFT
    }
  },
  {
    target: ".tour-phase-instructions",
    content:
      `The insructions for the current phase are displayed on the right.`,
    params: {
      placement: LEFT
    }
  },
  {
    target: ".tour-chat",
    content: `During the game, you can communicate with the other players in your habitat to plan and strategize. You can
          do this at any time during the game. Keep in mind that all chat is public and logged and there are no private
          messages. Also, please adhere to the Port of Mars Code of Conduct in your communications. Try sending a
          message!`,
    params: {
      placement: LEFT
    },
    stateTransform: [
      {
        SET_LAYOUT: "tutorial",
        ADD_TO_CHAT: {
          message: "Welcome to the Port of Mars!",
          role: CURATOR,
          dateCreated: new Date().getTime(),
          round: 0
        },
        required: true
      }
    ]
  },
  {
    target: ".tour-chat",
    content: "Quiz Question",
    params: {
      placement: LEFT,
      tutorialElementId: "chat"
    }
  }
];

export default steps;
