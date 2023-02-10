import { User } from '@port-of-mars/server/entity/User';
import { PlayerStatItem } from "@port-of-mars/shared/types";
import { TournamentRound } from "@port-of-mars/server/entity/TournamentRound";
import { Game, Player } from "@port-of-mars/server/entity";
import { BaseService } from "@port-of-mars/server/services/db";
import { IsNull, Not, SelectQueryBuilder } from "typeorm";
import { getLogger } from "@port-of-mars/server/settings";
import _ from "lodash";

const logger = getLogger(__filename);


export class LeaderboardService extends BaseService {

  async getStats(user: User, tournamentRound: TournamentRound): Promise<Array<PlayerStatItem>> {
    const games = await this.em.getRepository(Game)
      .find({
        join: { alias: 'games', innerJoin: { players: 'games.players' } },
        where: (qb: SelectQueryBuilder<Game>) => {
          qb.where({ tournamentRound, dateFinalized: Not(IsNull()) })
            .andWhere('players.user.id = :userId', { userId: user.id })
        },
        relations: ['players']
      });

    const previousGames: Array<PlayerStatItem> = games.map(g => {
      const maxScore = g.players.reduce((currentMax: number, player: Player) => {
        if (player.points ?? 0 > currentMax) {
          return player.points ?? 0;
        } else {
          return currentMax;
        }
      }, 0);
      const playerScores = g.players.map((player: Player) =>
      ({
        role: player.role,
        points: player.points ?? 0,
        winner: (player.points === maxScore),
        isSelf: player.userId === user.id,
      })
      );
      // sort players by points descending
      playerScores.sort((a, b) => b.points - a.points);

      return {
        time: g.dateCreated.getTime(),
        round: tournamentRound.id,
        tournamentName: tournamentRound.tournament.name,
        playerScores,
        victory: g.status === 'victory'
      }
    });
    return _.sortBy(previousGames, ['time'], ['desc']);
  }

}
