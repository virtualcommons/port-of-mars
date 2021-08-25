import { Step, LEFT } from '@port-of-mars/client/types/tutorial';
import { CURATOR } from '@port-of-mars/shared/types';

const steps: Array<Step> = [
  {
    target: '.tour-phase',
    content: `Information on the current state of the Port of Mars is always displayed here.`,
    params: {
      placement: LEFT,
    },
  },
  // {
  //   target: '.tour-ready-to-advance-button',
  //   content: `If you are finished with a given phase before the phase timer ends, click <mark>Ready
  //     to Advance</mark> to indicate that you are ready to move on and lock in your choices.
  //     <b>When every player in your group is Ready your group will immediately move on to the next phase.</b> There's no need to wait!`,
  //   params: {
  //     placement: LEFT,
  //   },
  // },
  // {
  //   target: '.tour-phase-instructions',
  //   content: `Current phase information will always be displayed here.`,
  //   params: {
  //     placement: LEFT,
  //   },
  // },
  {
    target: '.tour-chat',
    content:
      `Use chat to communicate with players during the game.
      Send a chat message to continue.
      Read <b><a target='_blank' href='https://github.com/virtualcommons/port-of-mars/wiki/Port-of-Mars-Chat-Code-of-Conduct'>Port of Mars Chat Code of Conduct</a></b>.`,
    params: {
      placement: LEFT,
    },
    stateTransform: [
      {
        SET_LAYOUT: 'tutorial',
        required: true,
      },
      {
        ADD_TO_CHAT: {
          message: `Chat is recorded. Adhere to the Port of Mars Chat Code of Conduct
          You cannot send private messages to other members in your group.`,
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
    ],
  },
  // {
  //   target: '.tour-chat',
  //   content: 'Quiz Question',
  //   params: {
  //     placement: LEFT,
  //     tutorialElementId: 'chat',
  //   },
  //   stateTransform: [
  //     {
  //       SET_CHATMARSLOG_VIEW: ChatMarsLogView.Chat,
  //     },
  //   ],
  // },
];

export default steps;
