import {getConnection} from "@/util";
import {Game} from "@/entity/Game";

export async function getGameById(id: number) {
  return await getConnection().getRepository(Game).findOneOrFail({id});
}