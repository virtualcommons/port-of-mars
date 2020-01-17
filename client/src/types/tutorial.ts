import {State} from "@/store/state";

export type MockRoom = { send: (data: any) => void, leave: () => void }

export interface Step {
  target: string
  content: string
  params: {
    placement: string
  },
  stateTransform?: (s: State) => State
}

