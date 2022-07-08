import { User, Game, Player } from "@port-of-mars/server/entity";
import { BaseService } from "@port-of-mars/server/services/db";
import { AdminStats } from "@port-of-mars/shared/types";
import { IsNull, Not, SelectQueryBuilder } from "typeorm";
import { getLogger, settings } from "@port-of-mars/server/settings";
import _ from "lodash";

const logger = getLogger(__filename);

export class AdminService extends BaseService {
  // select * from games and games.players where user.isBot == false
  async getAdminStats(): Promise<AdminStats> {
    const games = await this.em.getRepository(Game).find({
      join: { alias: "games", innerJoin: { players: "game.players" } },
      where: (qb: SelectQueryBuilder<Game>) => {
        qb.where({ dateFinalized: Not(IsNull()) });
      },
      relations: ["players"],
    });

    const totalGames: AdminStats["totalGames"] = _.size(games);

    const gameWithoutBots: AdminStats["gamesWithoutBots"] = _.size(
      games.map((g) => {
        g.players.forEach((player: Player) => {
          if (!player.user.isBot) {
            return g.roomId;
          }
        });
      })
    );

    const gamesWithoutBotsThatSurvived: AdminStats["gamesWithoutBotsThatSurvived"] =
      _.size(
        games.map((g) => {
          g.players.forEach((player: Player) => {
            if (!player.user.isBot && g.status == "victory") {
              return g.roomId;
            }
          });
        })
      );

    return {
      totalGames: totalGames,
      gamesWithoutBots: gameWithoutBots,
      gamesWithoutBotsThatSurvived: gamesWithoutBotsThatSurvived,
      reportedPlayers: 0,
    };
  }
}
