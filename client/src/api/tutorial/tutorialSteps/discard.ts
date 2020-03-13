import { Step } from "@port-of-mars/client/types/tutorial";
import { Phase } from "@port-of-mars/shared/types";

const steps:Array<Step> = [
    {
        target: `.tour-container-bottom`,
        content: `The last phase in a round is the discard phase!
        Here, you can get new Accomplishment cards to replace any card you may not like.
        Check it out!`,
        params: {
            placement: 'top',
        },
        stateTransform:[
            {
                SET_LAYOUT:'tutorial',
                SET_GAME_PHASE:Phase.discard,
                'required':true,
            }
        ]
    },
]

export default steps;
