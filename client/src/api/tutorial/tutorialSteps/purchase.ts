import {Step, TOP} from "@/types/tutorial";
import { Phase } from 'shared/types';

const steps:Array<Step> = [
    {
        target: `.tour-container-bottom`,
        content: `Ok, so now we've invested and traded our Investments! It's finally time to purchase Accomplishments!`,
        params:{
            placement: 'top'
        },
        stateTransform:[
            {
                SET_GAME_PHASE:Phase.purchase,
                SET_INVENTORY:{
                    data:{
                      culture: 10,
                      finance: 10,
                      government: 0,
                      legacy: 10,
                      science: 10,
                      upkeep: 0,
                    },
                    role:`Researcher`,
                },
                SET_ACTIVE_ACCOMPLISHMENTS: {
                    data:{
                        id: 6,
                        role: "Researcher",
                        label: "Highly Specialized",
                        flavorText: "You're solely focused on your research, to the exclusion of all other pursuits.",
                        science: 3,
                        government: 0,
                        legacy: 0,
                        finance: 0,
                        culture: 0,
                        upkeep: 0,
                        victoryPoints: 1,
                        effect: "You can no longer make Politics or Legacy Influence. Science Influence only costs 1 Time Block to make."
                    },
                    role: `Researcher`
                },
            },
        ]
    },
    {
        target: `.tour-purchase`,
        content: `Accomplishments that you can purchase have an orange header and are moved to the top!
        Try purchasing one now!`,
        params:{
            placement: TOP,
        },
        stateTransform:[
        {
            
            SET_ACTIVE_ACCOMPLISHMENTS:{
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
                role:'Researcher'
            },
            required:true
        }

        ]
    },
    {
        target: '.tour-accomplishments',
        content: `After you purchase one, it appears in the Purchased section! Try hitting 'Purchased' to see!`,
        params:{
            placement: 'right'
        },
        stateTransform: [
            {
                PURCHASE_ACCOMPLISHMENT:{
                data:{
                    id: 6,
                    role: "Researcher",
                    label: "Highly Specialized",
                    flavorText: "You're solely focused on your research, to the exclusion of all other pursuits.",
                    science: 3,
                    government: 0,
                    legacy: 0,
                    finance: 0,
                    culture: 0,
                    upkeep: 0,
                    victoryPoints: 1,
                    effect: "You can no longer make Politics or Legacy Influence. Science Influence only costs 1 Time Block to make."
                },
                role:`Researcher`
              },
              required: true,
            },
        ]
    }
]

export default steps; 