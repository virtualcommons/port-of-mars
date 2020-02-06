import Mutations from '@/store/mutationFolder';

export type MockRoom = { send: (data: any) => void, leave: () => void }

export type StateTransform = {[K in keyof typeof Mutations]?: Parameters<typeof Mutations[K]>[1]}


export interface Step {
  target: string
  content: string
  params: {
    placement: string
  },
  stateTransform?: StateTransform,
}

