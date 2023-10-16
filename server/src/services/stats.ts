import { User } from "@port-of-mars/server/entity/User";
import {
  LeaderboardData,
  PlayerStatItem,
  SoloHighscoresData,
  SoloPlayerStatItem,
} from "@port-of-mars/shared/types";
import { Game, Player, SoloGame, SoloPlayer } from "@port-of-mars/server/entity";
import { BaseService } from "@port-of-mars/server/services/db";
import { IsNull, Not, SelectQueryBuilder } from "typeorm";
import { SoloHighscores } from "@port-of-mars/server/entity/SoloHighscores";

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

  async updateSoloHighscores(gameId: number, points: number, maxRound: number): Promise<void> {
    // update the solo highscores table with data from a victory game and return the player's entry with rank
    const highscoresRepo = this.em.getRepository(SoloHighscores);
    const pointsPerRound = points / maxRound;
    const game = await this.em.getRepository(SoloGame).findOneOrFail(gameId, {
      relations: ["player", "player.user"],
    });
    const user = game.player.user;
    let highscore = await highscoresRepo.findOne({ user });

    if (highscore) {
      if (pointsPerRound > highscore.pointsPerRound) {
        highscore.pointsPerRound = pointsPerRound;
        highscore.maxRound = maxRound;
        highscore.points = points;
        highscore.gameId = gameId;
        await highscoresRepo.save(highscore);
      }
    } else {
      const newHighscore = highscoresRepo.create({
        user,
        maxRound,
        pointsPerRound,
        points,
        gameId,
      });
      await highscoresRepo.save(newHighscore);
      highscore = newHighscore;
    }
  }

  async getSoloHighscoresData(limit: number): Promise<SoloHighscoresData> {
    // get the top players in the solo highscores table
    const highscoresData = await this.em
      .getRepository(SoloHighscores)
      .createQueryBuilder("highscores")
      .select("ROW_NUMBER() OVER (ORDER BY highscores.pointsPerRound DESC)::integer as rank")
      .addSelect("user.username", "username")
      .addSelect("highscores.points", "points")
      .addSelect("highscores.maxRound", "maxRound")
      .addSelect("highscores.pointsPerRound", "pointsPerRound")
      .innerJoin("highscores.user", "user")
      .where("highscores.pointsPerRound IS NOT NULL")
      .orderBy("highscores.pointsPerRound", "DESC")
      .limit(limit)
      .getRawMany();
    return highscoresData as SoloHighscoresData;
  }

  async getSoloPlayerHistory(user: User): Promise<Array<SoloPlayerStatItem>> {
    const playerStats = await this.em
      .getRepository(SoloPlayer)
      .createQueryBuilder("player")
      .innerJoinAndSelect("player.game", "game")
      .where("player.user.id = :userId", { userId: user.id })
      .orderBy("game.dateCreated", "DESC")
      .select(["game.dateCreated", "game.status", "player.points", "game.maxRound"])
      .getMany();

    return playerStats.map(stat => ({
      time: stat.game.dateCreated.getTime(),
      points: stat.points ?? 0,
      victory: stat.game.status === "victory",
      maxRound: stat.game.maxRound,
    }));
  }
}
