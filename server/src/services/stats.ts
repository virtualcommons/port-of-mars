import { User } from "@port-of-mars/server/entity/User";
import { LeaderboardData, PlayerStatItem } from "@port-of-mars/shared/types";
import { Game, Player } from "@port-of-mars/server/entity";
import { BaseService } from "@port-of-mars/server/services/db";
import { IsNull, Not, SelectQueryBuilder } from "typeorm";

export class StatsService extends BaseService {
  /* Player stats */
  async getGamesWithUser(user: User): Promise<Array<Game>> {
    return this.em.getRepository(Game).find({
      join: { alias: "games", innerJoin: { players: "games.players" } },
      where: (qb: SelectQueryBuilder<Game>) => {
        qb.where({ dateFinalized: Not(IsNull()) }).andWhere("players.user.id = :userId", {
          userId: user.id,
        });
      },
      relations: ["players"],
      order: { dateCreated: "DESC" },
    });
  }

  async getPlayerHistory(user: User): Promise<Array<PlayerStatItem>> {
    const games = await this.getGamesWithUser(user);

    return games.map(g => {
      const maxScore = g.players.reduce((currentMax: number, player: Player) => {
        if ((player.points ?? 0) > currentMax) {
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
      // sort by role
      playerScores.sort((a, b) => a.role.localeCompare(b.role));

      return {
        time: g.dateCreated.getTime(),
        round: g.tournamentRoundId,
        playerScores,
        victory: g.status === "victory",
      };
    });
  }

  /* Leaderboard */
  getUserPointsQuery(options: { where: string; limit: number }) {
    return this.em
      .getRepository(Game)
      .createQueryBuilder("game")
      .select(
        "row_number() over (order by sum(case when game.status = 'victory' then player.points else 0 end) desc)",
        "rank"
      )
      .addSelect("user.username", "username")
      .addSelect("sum(case when game.status = 'victory' then player.points else 0 end)", "points")
      .addSelect("count(game.id) filter (where game.status = 'victory')", "wins")
      .addSelect("count(game.id) filter (where game.status = 'defeat')", "losses")
      .innerJoin("game.players", "player")
      .innerJoin("player.user", "user")
      .where(options.where) // where clause slot to change the set of considered games
      .groupBy("user.id")
      .having("sum(case when game.status = 'victory' then player.points else 0 end) IS NOT NULL")
      .orderBy("points", "DESC")
      .limit(options.limit);
  }

  async getLeaderboardWithBots(limit: number) {
    // don't include bots in the actual highschore data
    const query = this.getUserPointsQuery({ where: "user.isSystemBot = false", limit });
    return query.getRawMany();
  }

  async getLeaderboardWithoutBots(limit: number) {
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
      limit,
    });
    return query.getRawMany();
  }

  async getLeaderboardData(limit: number): Promise<LeaderboardData> {
    return {
      withBots: await this.getLeaderboardWithBots(limit),
      withoutBots: await this.getLeaderboardWithoutBots(limit),
    };
  }
}
