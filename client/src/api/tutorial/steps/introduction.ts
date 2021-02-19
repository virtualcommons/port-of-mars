import { Step, LEFT, TOP, BOTTOM } from '@port-of-mars/client/types/tutorial';
import { CURATOR } from '@port-of-mars/shared/types';
import { ChatMarsLogView } from '@port-of-mars/shared/game/client/panes';

const steps: Array<Step> = [
  {
    target: '.tour-phase',
    content: `Information on the current state of the Port of Mars is always displayed here: The current round, phase, and how much time is left in the phase.`,
    params: {
      placement: LEFT,
    },
  },
  {
    target: '.tour-round',
    content: `Port of Mars progresses in rounds. The total number of rounds can vary and a game will end after some number of rounds.`,
    params: {
      placement: BOTTOM,
    },
  },
  {
    target: '.tour-current-phase',
    content:
      `Each round consists of six phases: <br/> <b>New Round &#x2192; Event &#x2192; Invest ` +
      `&#x2192; Trade &#x2192; Purchase &#x2192; Discard</b>`,
    params: {
      placement: BOTTOM,
    },
  },
  {
    target: '.tour-time-remaining',
    content: `Each phase has a time limit, here it is 5 minutes. The timer will turn <b class='text-danger'>red</b> and <b>pulse</b> ` +
      `when the phase is about to end.`,
    params: {
      placement: TOP,
    }
  },
  {
    target: '.tour-ready-to-advance-button',
    content: `If you are finished with a given phase before the phase timer ends, click <mark>Ready
      to Advance</mark> to indicate that you are ready to move on and lock in your choices.
      <b>When every player in your group is Ready your group will immediately move on to the next phase.</b> There's no need to wait!`,
    params: {
      placement: LEFT,
    },
  },
  {
    target: '.tour-phase-instructions',
    content: `Current phase information will always be displayed here.`,
    params: {
      placement: LEFT,
    },
  },
  {
    target: '.tour-split-chat-log',
    content: `You can view the Port of Mars Chat or Mars Log here, or the default Split view which shows both.`,
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
      `At any time during the game, you can communicate with all of the other players ` +
      `in your group. The <b>chat is recorded</b> and you cannot send private messages within your group. ` +
      `Please <b>adhere to the <a target='_blank' href='https://github.com/virtualcommons/port-of-mars/wiki/Port-of-Mars-Chat-Code-of-Conduct'>Port of Mars Chat Code of Conduct</a></b> in your communications. ` +
      `Enter and send a chat message to continue.`,
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
