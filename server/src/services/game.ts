import { Game, GameEvent, Player } from "@port-of-mars/server/entity";
import { BaseService } from "@port-of-mars/server/services/db";
import { IsNull, Not, SelectQueryBuilder } from "typeorm";

export class GameService extends BaseService {
  async findById(id: number): Promise<Game> {
    return await this.em.getRepository(Game).findOneOrFail(id);
  }

  async findByRoomId(roomId: string): Promise<Game> {
    return await this.em.getRepository(Game).findOneOrFail({
      where: { roomId }
    });
  }

  async getTotalActiveGames(): Promise<number> {
    return await this.em.getRepository(Game).count({
      dateFinalized: IsNull(),
    });
  }

  async getTotalCompletedGames(): Promise<number> {
    return await this.em.getRepository(Game).count({
      where: [{ status: "victory" }, { status: "defeat" }],
    });
  }

  async getTotalGamesWithoutBots(status='victory'): Promise<number> {
    // select * from games g inner join players p inner join users u on g.id=p.gameId and p.userId=u.id where u.isBot=False
    const games = await this.em
      .getRepository(Game)
      .createQueryBuilder("game")
      .innerJoin("game.players", "player")
      .innerJoin("player.user", "user")
      .where("user.isBot = :isBot", { isBot: false })
      .andWhere("game.status = :status", { status })
      .getMany();
    return games.length;
  }

  async getAllActiveGames(): Promise<Array<Game>> {
    return await this.em.getRepository(Game).find({
      relations: ["players"],
      where: {
        dateFinalized: IsNull(),
      },
    });
  }

  async findEventsByGameId(gameId: number): Promise<Array<GameEvent>> {
    return await this.em
      .getRepository(GameEvent)
      .find({ where: { gameId }, order: { id: "ASC" } });
  }

  async getActiveGameRoomId(userId: number): Promise<string | undefined> {
    const game = await this.em
      .getRepository(Game)
      .createQueryBuilder("game")
      .innerJoin("game.players", "player")
      .innerJoin("player.user", "user")
      .where("game.status = 'incomplete'")
      .andWhere("user.id = :userId", { userId })
      .orderBy("game.dateCreated", "DESC")
      .getOne();

    return game?.roomId;
  }

  async getNumberOfActiveParticipants(
    tournamentRoundId?: number
  ): Promise<number> {
    if (!tournamentRoundId) {
      tournamentRoundId = (await this.sp.tournament.getCurrentTournamentRound())
        .id;
    }
    return await this.em
      .getRepository(Player)
      .createQueryBuilder("player")
      .innerJoin("player.game", "game")
      .where("game.status = 'incomplete'")
      .andWhere("game.tournamentRoundId = :tournamentRoundId", {
        tournamentRoundId,
      })
      .getCount();
  }

  async isUserInActiveGame(id: number) {
    return (
      (await this.em
        .getRepository(Game)
        .createQueryBuilder("game")
        .innerJoin("game.players", "player")
        .where("status = 'incomplete'")
        .andWhere("player.userId = :id", { id })
        .getCount()) > 0
    );
  }
}
