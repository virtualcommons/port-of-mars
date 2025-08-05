import { HiddenParams } from "./types";

export interface SetHiddenParams {
  kind: "set-hidden-params";
  data: HiddenParams;
}

export type SoloGameResponse = SetHiddenParams;
