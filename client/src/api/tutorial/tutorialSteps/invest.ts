import { Step, LEFT, TOP } from "@port-of-mars/client/types/tutorial";
import { Phase,RESEARCHER } from "@port-of-mars/shared/types";

const steps:Array<Step> = [
    {
      target: '.tour-investments',
      content: `The second phase is the Investment phase!`,
      params: {
        placement: LEFT
      },

      stateTransform: [
        {SET_GAME_PHASE:Phase.invest,
        SET_INVESTMENT_COSTS:{data:{
          culture: Number.MAX_SAFE_INTEGER,
          finance: Number.MAX_SAFE_INTEGER,
          government: 3,
          legacy: 3,
          science: 2,
          upkeep: 1
          // specialty: 'science'
        }, role: RESEARCHER},

      },
      {
        required: false,
      }
    ],
    },
    {
      target: '.tour-time-blocks',
      content:
        'You have 10 timeblocks to spend each round unless otherwise instructed.' +
        'You can spend these timeblocks on System Health or on Influence. ' +
        'Remember that you have 5 minutes to decide how to invest your timeblocks.',
      params: {
        placement: 'top'
      },

    },
    {
      target: '.tour-investments',
      content: `You cannot recycle timeblocks between rounds, so you should spend all of them, each round.`,
      params: {
        placement: 'top'
      },

    },
    {
      target: '.tour-investments',
      content:
        `The timeblock cost for each Influence can be seen in the bottom right hand corner. If you have enough
        timeblocks, you can earn Influence by pressing the '+' button. If you change your mind and decide not to invest
        your timeblocks into that particular resource you can reduce the number of timeblocks you have spent by pressing
        the '-' button next to that Influence resource.`,
      params: {
        placement: 'right'
      },

    },
    {
      target: '.tour-investments',
      content: `To try it out, purchase 2 science and 2 government!`,
      params:{
        placement: 'top'
      },
      stateTransform: [
        {
          required:true,
          validationObject:{
            science:2,
            government:2,
            legacy:0,
            culture:0,
            finance:0,
            upkeep:0,
          }
        }
      ]
    },

    {
      target: '.tour-investments',
      content: 'Quiz Question',
      params: {
        placement: TOP,
        tutorialElementId: 'timeblocks'
      }
    },
    {
      target: '.tour-ready-to-advance-button',
      content:
        'Click the Done button when you have finished investing your timeblocks. ' +
        'The Investment Phase will end as soon as all members of your group have finished investing.',
      params: {
        placement: 'right'
      },
      stateTransform: [
        {
          SET_LAYOUT: 'tutorial',
          required: true,
        }
      ]

    },
    {
      target: '.tour-investments',
      content: `Note that there are some Influences that you cannot earn on your own. For example, the Researcher cannot earn Culture or Finance Resources by investing their timeblocks. However, you may need these resources to purchase certain Accomplishment cards.`,
      params:{
        placement: 'top'
      }
    },
    {
      target: '.tour-accomplishments',
      content: `For example, this Accomplishment card requires 1 Culture, which you cannot earn. To get this Resource, you must trade with someone who has 1 Culture.`,
      params: {
        placement:'right'
      }
    }
]

export default steps;
