import { Game, GameEvent, Player, TournamentRoundInvite } from "@port-of-mars/server/entity";
import { EntityManager, In } from "typeorm";

export class GameService {
  constructor(public em: EntityManager) {
  }

  async findById(id: number): Promise<Game> {
    return await this.em.getRepository(Game).findOneOrFail({ id });
  }

  async finalize(gameId: number): Promise<[Game, Array<Player>, Array<TournamentRoundInvite>]> {
    const event = await this.em.getRepository(GameEvent).findOneOrFail({
      where: { type: In(['entered-defeat-phase', 'entered-victory-phase']), gameId },
      order: { id: "DESC", dateCreated: "DESC" }
    });
    const game = await this.em.getRepository(Game).findOneOrFail({ id: gameId });
    const players = await this.em.getRepository(Player).find({ gameId });
    for (const p of players) {
      p.points = (event.payload as any)[p.role];
    }
    const invites = await this.em.createQueryBuilder()
      .from(TournamentRoundInvite, 'invite')
      .innerJoin('invite.tournamentRound', 'round')
      .innerJoin('round.games', 'game')
      .getMany();
    for (const invite of invites) {
      invite.hasParticipated = true;
    }
    game.status = event.type === 'entered-defeat-phase' ? 'defeat' : 'victory';
    return await Promise.all([this.em.save(game), this.em.save(players), this.em.save(invites)]);
  }

  async getLatestActiveGameByUserId(userId: number): Promise<string | undefined> {
    const g = await this.em.getRepository(Game).findOne({
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
}