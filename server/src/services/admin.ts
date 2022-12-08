import { matchMaker } from "colyseus";
import { GameRoom } from "@port-of-mars/server/rooms/game";
import { RankedLobbyRoom } from "@port-of-mars/server/rooms/lobby";
import { ChatReport } from "@port-of-mars/server/entity";
import { BaseService } from "@port-of-mars/server/services/db";
import { AdminStats, ChatReportData, ChatMessageData, InspectData } from "@port-of-mars/shared/types";
import { getLogger } from "@port-of-mars/server/settings";
import _ from "lodash";

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

  async getLobbyData(): Promise<any> {
    const lobby = await matchMaker.findOneRoomAvailable(RankedLobbyRoom.NAME, {});
    return lobby ?? {};
  }

  async getActiveRooms(): Promise<any> {
    const games = await matchMaker.query({ name: GameRoom.NAME });
    return games.map((g: any) => {
      return {
        roomId: g.roomId,
        clients: g.clients,
        elapsed: Date.now() - new Date(g.createdAt).getTime()
      }
    });
  }

  async getInspectData(roomId: string): Promise<InspectData | undefined> {
    if (roomId && await matchMaker.query({ roomId })) {
      try {
        const data = await matchMaker.remoteRoomCall(roomId, "getInspectData");
        return data;
      } catch (e) {
        return undefined;
      }
    }
  }

  async getChatReports(): Promise<Array<ChatReportData>> {
    const reports = await this.em
      .getRepository(ChatReport)
      .createQueryBuilder("report")
      .innerJoinAndSelect("report.game", "game")
      .innerJoinAndSelect("report.user", "user")
      .getMany();
    logger.debug(reports)
    return reports.map((r: ChatReport) => {
      return {
        id: r.id,
        username: r.user.username,
        isBanned: r.user.isBanned,
        roomId: r.game.roomId,
        message: r.message as ChatMessageData,
        resolved: r.resolved,
        dateCreated: r.dateCreated
      }
    });
  }

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

  async resolveReport(data: { reportId: number, resolved: boolean, username: string, ban: boolean }) {
    if (data.ban) {
      this.sp.account.banByUsername(data.username);
    }
    const repository = this.em.getRepository(ChatReport);
    const report = await repository.findOneOrFail({ id: data.reportId });
    report.resolved = data.resolved;
    await repository.save(report);
  }
}
