import {Step} from '@/types/tutorial';

const steps:Array<Step> = [
    {
      target: '.tour-profile',
      content: `
        There are 5 roles in the Port of Mars: Researcher, Pioneer, Curator, Entrepreneur, and Politician.`,
        params:{
          placement: 'bottom'
        }
    },
    {
        target: '.tour-profile',
        content:
          'This is your role and score during the game. Your role determines ' +
          'the investments in influence currency you can make and the accomplishments ' +
          'that you can purchase toward the end of a round.',
        params: {
          placement: 'bottom'
        }
    },
    
    {
        target: '.tour-players',
        content:
          `These are the other four residents of the Port of Mars. During some events, you will be able to interact with their icons here.
          The player score is displayed on the far left; name in the middle;
          and character avatar on the right.`,
        params: {
          placement: 'left'
        }
    },
    {
        target: '.tour-profile-investments',
        content: 'As you purchase Timeblocks during the invest phase, your inventory will update here.',
        params: {
          placement: 'right'
        },
        
    },
    {
      target: '.tour-accomplishments',
      content: `Here, you can see what Accomplishments are avaliable to you this round. As you buy them, you will be given new ones.
      Once you purchase them, they will move to the purchased section.`,
      params: {
        placement: `right`
      },
      stateTransform:[
        {SET_ACTIVE_ACCOMPLISHMENTS:{
          data:{
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
          role:`Researcher`
        },
        PURCHASE_ACCOMPLISHMENT:{
          data:{
            id: 2,
            role: "Researcher",
            label: "Mars Helicopter",
            flavorText: "Your invention of a low gravity, low atmosphere, low-flying vehicle enables greater exploration of the Martian surface.",
            science: 2,
            government: 0,
            legacy: 0,
            finance: 1,
            culture: 1,
            upkeep: 0,
            victoryPoints: 3,
            effect: ""
          },
          role:`Researcher`
        },
      }]
    }
    
]

export default steps;