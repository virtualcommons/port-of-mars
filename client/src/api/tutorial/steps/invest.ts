import { Step, TOP, RIGHT, BOTTOM } from "@port-of-mars/client/types/tutorial";
import { Phase, RESEARCHER } from "@port-of-mars/shared/types";

const steps: Array<Step> = [
  {
    target: ".tour-phase",
    content: `The second phase is the Investment phase!`,
    params: {
      placement: RIGHT
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
            // specialty: 'science'
          },
          role: RESEARCHER
        }
      },
      {
        required: false
      }
    ]
  },
  {
    target: ".tour-accomplishments",
    content: `Here, you can see what Accomplishments are avaliable to you this round. As you purchase them, you will be given new ones.
      Once you purchase them, they will move to the purchased section.`,
    params: {
      placement: RIGHT
    },
    stateTransform: [
      {
        SET_ACTIVE_ACCOMPLISHMENTS: {
          data: {
            id: 1,
            role: "Researcher",
            label: "Interdisciplinary",
            flavorText: "You have more PhD's than most people have common sense.",
            science: 2,
            government: 1,
            legacy: 1,
            finance: 1,
            culture: 1,
            upkeep: 0,
            victoryPoints: 5,
            effect: ""
          },
          role: `Researcher`
        },
        PURCHASE_ACCOMPLISHMENT: {
          data: {
            id: 2,
            role: "Researcher",
            label: "Mars Helicopter",
            flavorText:
              "Your invention of a low gravity, low atmosphere, low-flying vehicle enables greater exploration of the Martian surface.",
            science: 2,
            government: 0,
            legacy: 0,
            finance: 1,
            culture: 1,
            upkeep: 0,
            victoryPoints: 3,
            effect: ""
          },
          role: `Researcher`
        }
      }
    ]
  },
  {
    target: ".tour-time-blocks",
    content:
      "You have 10 timeblocks to spend each round unless otherwise instructed." +
      "You can spend these timeblocks on System Health or on Influence. " +
      "Remember that you have 5 minutes to decide how to invest your timeblocks.",
    params: {
      placement: BOTTOM
    }
  },
  {
    target: ".tour-invest",
    content: `You cannot recycle timeblocks between rounds, so you should spend all of them, each round.`,
    params: {
      placement: RIGHT
    }
  },
  {
    target: ".tour-invest",
    content: `The timeblock cost for each Influence can be seen in the bottom right hand corner. If you have enough
        timeblocks, you can earn Influence by pressing the '+' button. If you change your mind and decide not to invest
        your timeblocks into that particular resource you can reduce the number of timeblocks you have spent by pressing
        the '-' button next to that Influence resource.`,
    params: {
      placement: RIGHT
    }
  },
  {
    target: ".tour-invest-action",
    content: `To try it out, purchase 2 science and 2 government!`,
    params: {
      placement: TOP
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
          upkeep: 0
        }
      }
    ]
  },

  {
    target: ".tour-invest-action",
    content: "Quiz Question",
    params: {
      placement: RIGHT,
      tutorialElementId: "timeblocks"
    }
  },
  {
    target: ".tour-ready-to-advance-button",
    content:
      "Click the Ready to Advance button when you have finished investing your timeblocks. " +
      "The Investment Phase will end as soon as all members of your group have finished investing.",
    params: {
      placement: "left"
    },
    stateTransform: [
      {
        SET_LAYOUT: "tutorial",
        required: true
      }
    ]
  },
  {
    target: ".tour-invest",
    content: `Note that there are some Influences that you cannot earn on your own. For example, the Researcher cannot earn Culture or Finance Resources by investing their timeblocks. However, you may need these resources to purchase certain Accomplishment cards.`,
    params: {
      placement: TOP
    }
  },
  {
    target: ".tour-accomplishments",
    content: `For example, this Accomplishment card requires 1 Culture, which you cannot earn. To get this Resource, you must trade with someone who has 1 Culture.`,
    params: {
      placement: RIGHT
    }
  }
];

export default steps;
