import { Step, RIGHT, TOP, BOTTOM } from '@port-of-mars/client/types/tutorial';

const steps: Array<Step> = [
  {
    target: '.tour-profile',
    content: `
        There are 5 roles in the Port of Mars: Researcher, Pioneer, Curator, Entrepreneur, and Politician.`,
    params: {
      placement: RIGHT,
    },
  },
  {
    target: '.tour-player-self',
    content:
      'This is your role and score during the game. Your role determines ' +
      'the investments in influence currency you can make and the accomplishments ' +
      'that you can purchase toward the end of a round.',
    params: {
      placement: RIGHT,
    },
    stateTransform: [
      {
        SET_LAYOUT: `tutorial`,
        // required: true,
        // validationObject: {
        // }
      },
    ],
  },
  // {
  //   target: ".tour-player-info-modal",
  //   content:
  //     `This will display all information related to your player.`,
  //   params: {
  //     placement: RIGHT
  //   },
  //   stateTransform: [
  //     {
  //       SET_LAYOUT: `tutorial`,
  //       required: true,
  //     }
  //   ]
  // },
  {
    target: '.tour-players',
    content: `These are the other four residents of the Port of Mars. During some events, you will be able to interact with their icons here.
          The player score is displayed on the far left; name in the middle;
          and character avatar on the right.`,
    params: {
      placement: RIGHT,
    },
  },
  {
    target: '.tour-inventory-popup',
    content:
      'When you purchase resources during the invest phase, your inventory will update here.',
    params: {
      placement: TOP,
    },
    stateTransform: [
      {
        SET_LAYOUT: `tutorial`,
        // required: true,
      },
    ],
  },
  {
    target: '.tour-log-popup',
    content:
      `You can click here to view the mars log, which displays a history of what has happened during the game.` +
      ` Make sure you check this periodically!`,
    params: {
      placement: TOP,
    },
    stateTransform: [
      {
        SET_LAYOUT: `tutorial`,
        // required: true,
      },
    ],
  },
];

export default steps;
