import {Game, GameEvent, Player, TournamentRoundInvite} from "@port-of-mars/server/entity";
import {BaseService} from "@port-of-mars/server/services/db";
import {IsNull} from "typeorm";

export class GameService extends BaseService {
  async findById(id: number): Promise<Game> {
    return await this.em.getRepository(Game).findOneOrFail({id});
  }

  async getLatestActiveGameByUserId(userId: number): Promise<string | undefined> {
    const g = await this.em.getRepository(Game).findOne({
        where: {
          players: {
            user: {
              id: userId
            }
          },
          dateFinalized: IsNull(),
        },
        order: {
          dateCreated: 'DESC'
        }
      }
    );
    return g?.roomId;
  }
}