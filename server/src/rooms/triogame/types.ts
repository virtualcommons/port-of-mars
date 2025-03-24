import { Client, Room } from "colyseus";
import { TrioGameState } from "./state";
import { User } from "@port-of-mars/server/entity/User";
import { SoloGameType } from "@port-of-mars/shared/sologame";

//FIXME: refine for trio version
export interface TrioGameOpts {
  users: Array<User>;
  type: SoloGameType;
}
