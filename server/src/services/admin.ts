import { User, Game, Player, ChatReport } from "@port-of-mars/server/entity";
import { BaseService } from "@port-of-mars/server/services/db";
import { AdminStats, ChatReportData, ChatMessageData } from "@port-of-mars/shared/types";
import { IsNull, Not, SelectQueryBuilder } from "typeorm";
import { getLogger, settings } from "@port-of-mars/server/settings";
import _ from "lodash";
import { getServices } from ".";

const logger = getLogger(__filename);

export class AdminService extends BaseService {

  async getAdminStats(): Promise<AdminStats> {
    const totalDefeats = await this.sp.game.getTotalCompletedGames({ status: "defeat" });
    const defeatsWithBots = await this.sp.game.getTotalGamesWithBots({ status: "defeat" });
    const totalVictories = await this.sp.game.getTotalCompletedGames({ status: "victory" });
    const victoriesWithBots = await this.sp.game.getTotalGamesWithBots({ status: "victory" });
    return {
      totalGames: totalDefeats + totalVictories,
      activeGames: await this.sp.game.getTotalActiveGames(),
      defeats: {
        withBots: defeatsWithBots,
        withoutBots: totalDefeats - defeatsWithBots,
      },
      victories: {
        withBots: victoriesWithBots,
        withoutBots: totalVictories - victoriesWithBots,
      },
      totalUsers: await this.sp.account.getTotalRegisteredUsers(),
      reportedUsers: await this.sp.account.getTotalReportedUsers(),
      bannedUsers: await this.sp.account.getTotalBannedUsers(),
    }
  }

  // select * from games and games.players where user.isBot == false
  // async getData(): Promise<any> {
  //   const games = await this.em.getRepository(Game).find({
  //     join: { alias: "games", innerJoin: { players: "game.players" } },
  //     where: (qb: SelectQueryBuilder<Game>) => {
  //       qb.where({ dateFinalized: Not(IsNull()) });
  //     },
  //     relations: ["players"],
  //   });

  //   const totalGames: AdminStats["totalGames"] = _.size(games);

  //   const gameWithoutBots: AdminStats["gamesWithoutBots"] = _.size(
  //     games.map((g) => {
  //       g.players.forEach((player: Player) => {
  //         if (!player.user.isBot) {
  //           return g.roomId;
  //         }
  //       });
  //     })
  //   );

  //   const gamesWithoutBotsThatSurvived: AdminStats["gamesWithoutBotsThatSurvived"] =
  //     _.size(
  //       games.map((g) => {
  //         g.players.forEach((player: Player) => {
  //           if (!player.user.isBot && g.status == "victory") {
  //             return g.roomId;
  //           }
  //         });
  //       })
  //     );

  //   return {
  //     totalGames: totalGames,
  //     gamesWithoutBots: gameWithoutBots,
  //     gamesWithoutBotsThatSurvived: gamesWithoutBotsThatSurvived,
  //     reportedPlayers: 0,
  //   };
  // }

  async submitReport(data: ChatReportData) {
    logger.debug("user in room: %s submitted report for chat message sent by: %s",
      data.roomId, data.username);
    const game = await this.sp.game.findByRoomId(data.roomId);
    const user = await this.sp.account.findByUsername(data.username);
    const message = data.message;
    const repository = this.em.getRepository(ChatReport);
    const scheduledDate = repository.create({
      game,
      gameId: game.id,
      user,
      userId: user.id,
      message
    });
    await repository.save(scheduledDate);
  }
}
