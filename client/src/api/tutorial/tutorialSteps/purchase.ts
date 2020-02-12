import {Step} from "@/types/tutorial";
import { Phase } from 'shared/types';

const steps:Array<Step> = [
    {
        target: `.tour-purchase-header`,
        content: `Ok, so now we've invested and traded our investments! It's finally time to purchase accomplishments!`,
        params:{
            placement: 'top'
        },
        stateTransform:[
            {
                SET_GAME_PHASE:Phase.purchase,
                SET_INVENTORY:{
                    data:{
                      culture: 0,
                      finance: 5,
                      government: 5,
                      legacy: 0,
                      science: 5,
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
        content: `Accomplishments that you can buy have an orange header and are moved to the top!
        Try buying one now!`,
        params:{
            placement: 'bottom'
        },
        stateTransform:[
            {required:true}
        ]
    },
    {
        target: '.tour-accomplishments',
        content: `After you buy one, it appears in the purchased section!`,
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
              
            },
        ]
    }
]

export default steps; 