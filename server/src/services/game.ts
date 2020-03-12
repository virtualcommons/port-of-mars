import {getConnection} from "@port-of-mars/server/util";
import {Game} from "@port-of-mars/server/entity/Game";

export async function getGameById(id: number) {
  return await getConnection().getRepository(Game).findOneOrFail({id});
}

export async function getLatestActiveGameByUserId(userId: number): Promise<string | undefined> {
  const g = await getConnection().getRepository(Game).findOne({
      where: {
        players: {
          user: {
            id: userId
          }
        },
        completed: false
      },
     order: {
        dateCreated: 'DESC'
     }
    }
  );
  return g?.roomId;
}