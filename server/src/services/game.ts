import {Game} from "@port-of-mars/server/entity/Game";
import {EntityManager} from "typeorm";
import {Player} from "@port-of-mars/server/entity/Player";
import {GameEvent} from "@port-of-mars/server/entity/GameEvent";
import {ROLES} from "@port-of-mars/shared/types";
import {TournamentRoundInvite} from "@port-of-mars/server/entity/TournamentRoundInvite";
import {TournamentRound} from "@port-of-mars/server/entity/TournamentRound";

export class GameService {
  constructor(public em: EntityManager) {}

  async findById(id: number): Promise<Game> {
    return await this.em.getRepository(Game).findOneOrFail({id});
  }

  async finalize(gameId: number): Promise<[Game, Array<Player>, Array<TournamentRoundInvite>]> {
    const event = await this.em.getRepository(GameEvent).findOneOrFail({gameId}, {order: {dateCreated: "DESC"}});
    const game = await this.em.getRepository(Game).findOneOrFail({id: gameId});
    const players = await this.em.getRepository(Player).find({gameId});
    for (const p of players) {
      p.points = (event.payload as any).players[p.role].victoryPoints;
    }
    const invites = await this.em.createQueryBuilder()
      .from(TournamentRoundInvite, 'invite')
      .innerJoin('invite.tournamentRound', 'round')
      .innerJoin('round.games', 'game')
      .getMany();
    for (const invite of invites) {
      invite.hasParticipated = true;
    }
    game.completed = true;
    return await Promise.all([this.em.save(game), this.em.save(players), this.em.save(invites)]);
  }
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