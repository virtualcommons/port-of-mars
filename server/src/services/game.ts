import {getConnection} from "@port-of-mars/server/util";
import {Game} from "@port-of-mars/server/entity/Game";

export async function getGameById(id: number) {
  return await getConnection().getRepository(Game).findOneOrFail({id});
}