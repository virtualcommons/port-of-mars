import Mutations from "@port-of-mars/client/store/mutations";

export type MockRoom = { send: (type: string, data: any) => void; leave: () => void };

export type StateTransform = {
  [K in keyof typeof Mutations]?: Parameters<(typeof Mutations)[K]>[1];
} & { required?: boolean; validationObject?: any };

export interface Step {
  target: string;
  content: string;
  params: {
    placement: string;
    tutorialElementId?: string;
  };
  stateTransform?: Array<StateTransform>;
}

//A blueprint for a step:
/*
{
  target: '<css class you want to attach the step to>',
  content: `<message on the step>`,
  params: {
    placement: <location>
  },
  stateTransform: [
    {
      <optional required tag>: <true | false>
      NOTE: This requires some sort of check in the TutorialAPI
      Having the required tag does not require you to have a validation object.

      <optional validationObject>: <object requirements>

      <optional mutation>:<mutation's data>
    }
  ]
}
*/

//sometimes the placement is inverted in vue tour.
//the ones that are tagged with caps are the inverted ones.
export const TOP: string = "bottom";
export const BOTTOM: string = "top";
export const LEFT: string = "right";
export const RIGHT: string = "left";
