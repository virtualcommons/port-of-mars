import { Step, LEFT, TOP, BOTTOM } from '@port-of-mars/client/types/tutorial';
import { CURATOR } from '@port-of-mars/shared/types';
import { ChatMarsLogView } from '@port-of-mars/shared/game/client/panes';

const steps: Array<Step> = [
  {
    target: '.tour-phase',
    content: `Information on the current state of the Port of Mars is always displayed here.`,
    params: {
      placement: LEFT,
    },
  },
  {
    target: '.tour-round',
    content: `Port of Mars progresses in rounds. The total number of rounds may vary and a game may end after any number of rounds.`,
    params: {
      placement: BOTTOM,
    },
  },
  {
    target: '.tour-current-phase',
    content:
      `Every round consists of the following phases: New Round, Event, Investment, Trade, Purchase ` +
      `and Discard.`,
    params: {
      placement: BOTTOM,
    },
  },
  {
    target: '.tour-time-remaining',
    content: `Each phase has a time limit of 5 minutes. The timer turns red and pulses ` +
      `when 1 minute is left in the phase.`,
    params: {
      placement: TOP,
    }
  },
  {
    target: '.tour-ready-to-advance-button',
    content: `If you are finished with your actions in a given phase before the 5 minutes are up, click Ready
      to Advance to indicate that you are ready to move on and lock in your choices.
      When every player in your group has indicated that they are
      ready, the phase will end and your group will move on to the next phase.`,
    params: {
      placement: LEFT,
    },
  },
  {
    target: '.tour-phase-instructions',
    content: `These are instructions for the current phase. Refer to these instructions if ` +
      `you aren't sure what to do during a phase.`,
    params: {
      placement: LEFT,
    },
  },
  {
    target: '.tour-split-chat-log',
    content: `You can view the Port of Mars Chat or Mars Log here, or both using the Split view option.`,
    params: {
      placement: LEFT,
    },
    stateTransform: [
      {
        ADD_TO_CHAT: {
          message: 'Welcome to the Port of Mars!',
          role: CURATOR,
          dateCreated: new Date().getTime(),
          round: 0,
        },
      },
      {
        ADD_TO_MARS_LOG: {
          performedBy: 'Server',
          category: 'EVENT - Life As Usual',
          content: 'As the first human outpost on Mars, having a "usual" day is pretty unusual.',
          round: 1,
          timestamp: 8,
          id: 1
        }
      }
    ]
  },
  {
    target: '.tour-chat',
    content:
      `At any time during the game, you can communicate with the other players ` +
      `in your group to plan and strategize. Remember: all chat is public ` +
      `and recorded and there are no private messages. Please adhere to the Port of ` +
      `Mars Code of Conduct in your communications. Try sending a message!`,
    params: {
      placement: LEFT,
    },
    stateTransform: [
      {
        SET_LAYOUT: 'tutorial',
        SET_CHATMARSLOG_VIEW: ChatMarsLogView.Chat,
        required: true,
      },
    ],
  },
  {
    target: '.tour-chat',
    content: 'Quiz Question',
    params: {
      placement: LEFT,
      tutorialElementId: 'chat',
    },
    stateTransform: [
      {
        SET_CHATMARSLOG_VIEW: ChatMarsLogView.Chat,
      },
    ],
  },
];

export default steps;
