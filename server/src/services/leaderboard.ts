import { User } from "@port-of-mars/server/entity/User";
import { LeaderboardData, PlayerStatItem } from "@port-of-mars/shared/types";
// import { TournamentRound } from "@port-of-mars/server/entity/TournamentRound";
import { Game, Player } from "@port-of-mars/server/entity";
import { BaseService } from "@port-of-mars/server/services/db";
import { IsNull, Not, SelectQueryBuilder } from "typeorm";
import _ from "lodash";

export class LeaderboardService extends BaseService {
  async getStats(user: User): Promise<Array<PlayerStatItem>> {
    const games = await this.em.getRepository(Game).find({
      join: { alias: "games", innerJoin: { players: "games.players" } },
      where: (qb: SelectQueryBuilder<Game>) => {
        qb.where({ dateFinalized: Not(IsNull()) }).andWhere("players.user.id = :userId", {
          userId: user.id,
        });
      },
      relations: ["players"],
    });

    const previousGames: Array<PlayerStatItem> = games.map(g => {
      const maxScore = g.players.reduce((currentMax: number, player: Player) => {
        if (player.points ?? 0 > currentMax) {
          return player.points ?? 0;
        } else {
          return currentMax;
        }
      }, 0);
      const playerScores = g.players.map((player: Player) => ({
        role: player.role,
        points: player.points ?? 0,
        winner: player.points === maxScore,
        isSelf: player.userId === user.id,
      }));
      // sort players by points descending
      playerScores.sort((a, b) => b.points - a.points);

      return {
        time: g.dateCreated.getTime(),
        round: g.tournamentRoundId,
        playerScores,
        victory: g.status === "victory",
      };
    });
    return _.sortBy(previousGames, ["time"], ["desc"]);
  }

  getUserPointsQuery(options: { where: string }, limit = 50) {
    return this.em
      .getRepository(Game)
      .createQueryBuilder("game")
      .select("row_number() over (order by sum(player.points) desc)", "rank")
      .addSelect("user.username", "username")
      .addSelect("sum(player.points)", "points")
      .addSelect("count(game.id) filter (where game.status = 'victory')", "wins")
      .addSelect("count(game.id) filter (where game.status = 'defeat')", "losses")
      .innerJoin("game.players", "player")
      .innerJoin("player.user", "user")
      .where(options.where) // where clause slot to change the set of considered games
      .groupBy("user.id")
      .orderBy("points", "DESC")
      .limit(limit);
  }

  async getLeaderboardWithBots() {
    // don't include bots in the actual highschore data
    const query = this.getUserPointsQuery({ where: "user.isSystemBot = false" });
    return query.getRawMany();
  }

  async getLeaderboardWithoutBots() {
    // sub-query to get all games that don't have any bots
    const noBotGamesQuery = this.em
      .getRepository(Game)
      .createQueryBuilder("game")
      .select("game.id")
      .innerJoin("game.players", "player")
      .innerJoin("player.user", "user")
      .where("user.isSystemBot = false")
      .groupBy("game.id")
      .having("count(*) = 5");

    const query = this.getUserPointsQuery({
      where: `game.id in ( ${noBotGamesQuery.getQuery()} )`,
    });
    return query.getRawMany();
  }

  async getLeaderboardData(): Promise<LeaderboardData> {
    return {
      withBots: await this.getLeaderboardWithBots(),
      withoutBots: await this.getLeaderboardWithoutBots(),
    };
  }
}
