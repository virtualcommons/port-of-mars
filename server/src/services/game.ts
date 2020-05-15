import {Game, GameEvent, Player, TournamentRoundInvite} from "@port-of-mars/server/entity";
import {BaseService} from "@port-of-mars/server/services/db";
import {IsNull} from "typeorm";

export class GameService extends BaseService {
  async findById(id: number): Promise<Game> {
    return await this.em.getRepository(Game).findOneOrFail({id});
  }

  async findEventsByGameId(gameId: number): Promise<Array<GameEvent>> {
    return await this.em.getRepository(GameEvent).find({where: {gameId}, order: {id: "ASC"}});
  }

  async getActiveGameRoomId(userId: number): Promise<string | undefined> {
    const game = await this.em.getRepository(Game).findOne({
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
    return game?.roomId;
  }
}