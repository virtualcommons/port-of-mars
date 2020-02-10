import Mutations from '@/store/mutationFolder';
import { State } from '@/store/state';

export type MockRoom = { send: (data: any) => void; leave: () => void };

export type StateTransform = {
  [K in keyof typeof Mutations]?: Parameters<typeof Mutations[K]>[1]
};

export interface Step {
  target: string;
  content: string;
  params: {
    placement: string;
    tutorialElementId?: string;
  };
  stateTransform?: StateTransform;
}
