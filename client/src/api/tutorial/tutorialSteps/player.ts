import {Step} from '@/types/tutorial';

const steps:Array<Step> = [
    {
        target: '.tour-profile',
        content:
          'This is your role and score during the game. Your role determines ' +
          'the investments in influence currency you can make and the accomplishments ' +
          'that you can purchase toward the end of a round.',
        params: {
          placement: 'bottom'
        },
        stateTransform: {
          CLEAR_NOTIFICATION:1,
        }
       
    },
    {
        target: '.tour-profile-investments',
        content: 'After you finish investing your timeblocks, your inventory will update here.',
        params: {
          placement: 'right'
        },
        
    },
    {
        target: '.tour-players',
        content:
          'These are the other residents of Port of Mars. There are 5 roles in the game: ' +
          'Researcher, Pioneer, Curator, Entrepreneur, and Politician.',
        params: {
          placement: 'left'
        }
    },
    {
        target: '.tour-players',
        content:
          'The player score is displayed on the far left; name in the middle; ' +
          'and character art on the right.',
        params: {
          placement: 'left'
        }
    },
    
]

export default steps;