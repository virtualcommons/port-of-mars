import { Step, RIGHT, LEFT, TOP } from '@port-of-mars/client/types/tutorial';

const steps: Array<Step> = [
  {
    target: '.tour-profile',
    content: `There are 5 roles in the Port of Mars: Researcher, Pioneer, Curator, ` +
             `Entrepreneur, and Politician.`,
    params: {
      placement: RIGHT
    }
  },
  {
    target: '.tour-player-self',
    content: `This is your role and score. Your role determines the resource that ` +
             `you can invest your timeblocks in and accomplishments that you can ` +
             `purchase toward the end of a round. Click on your player to reveal ` +
             `more information about your player.`,
    params: {
      placement: RIGHT
    },
    stateTransform: [
      {
        required: true
      }
    ]
  },
  {
    target: '.tour-player-info-modal',
    content: `This menu displays all information related to your player. `,
    params: {
      placement: RIGHT
    },
    stateTransform: [
      {
        SET_MODAL_VISIBLE: {
          type: 'PlayerModal',
          data: {role: 'Researcher'}
        }
      }
    ]
  },
  {
    target: '.tour-player-info-modal-stats',
    content: `Your player stats include your role, current score in the ` +
             `game, and your ranking against other players.`,
    params: {
      placement: 'top'
    },
  },
  {
    target: '.tour-player-info-modal-inventory',
    content: `This is your inventory of Resources and Accomplishments.`,
    params: {
      placement: LEFT
    },
  },
  {
    target: '.tour-player-info-modal-accomplishments',
    content: `Here are the Accomplishments that you can buy and own.`,
    params: {
      placement: RIGHT
    },
  },
  {
    target: '.tour-profile-menu',
    content: `Click here to reveal a menu that allows you to access your player dashboard and log out.`,
    params: {
      placement: 'right',
    },
    stateTransform: [
      {
        required: true,
        SET_MODAL_HIDDEN: 'hide',
      }
    ]
  },
  {
    target: '.tour-players',
    content: `These are the other four residents of the Port of Mars. Some events may ` +
             `allow you to click and view other players' inventories.`,
    params: {
      placement: RIGHT
    },
    stateTransform: [
      {
        SET_PROFILE_MENU_VISIBILITY: false,
      }
    ]
  },
  {
    target: '.tour-inventory-popup',
    content: `When you invest timeblocks into Resources during the invest phase, ` +
             `your inventory updates.`,
    params: {
      placement: 'left',
    },
    stateTransform: [
      {
        SET_INVENTORY_POPUP_VISIBILITY: true,
      }
    ]
  },
  {
    target: '.tour-log-popup',
    content: `This is the Mars Log, which details a history of what has happened ` +
             `during the game. Make sure you check this periodically!`,
    params: {
      placement: 'left',
    },
    stateTransform: [
      {
        SET_INVENTORY_POPUP_VISIBILITY: false,
        SET_MARS_LOG_POPUP_VISIBILITY: true,
      }
    ]
  }
];

export default steps;
