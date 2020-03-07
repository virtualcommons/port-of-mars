import Mutations from '@/store/mutationFolder';
import { State } from '@/store/state';
import { ResourceAmountData } from 'shared/types';

export type MockRoom = { send: (data: any) => void, leave: () => void }

export type StateTransform =
   { [K in keyof typeof Mutations]?: Parameters<typeof Mutations[K]>[1] }
  & { required?: boolean, validationObject?:any }
  & {rootChange?: string};

export interface Step {
  target: string;
  content: string;
  params: {
    placement: string;
    tutorialElementId?: string;
  };
  stateTransform?: Array<StateTransform>;
}

//sometimes the placement is inverted in vue tour.
//the ones that are tagged with caps are the inverted ones.
export const TOP:string = 'bottom';
export const BOTTOM:string = 'top';
export const LEFT:string = 'right';
export const RIGHT:string = 'left';
