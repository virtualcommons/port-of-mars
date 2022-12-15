import { matchMaker } from "colyseus";
import { GameRoom } from "@port-of-mars/server/rooms/game";
import { RankedLobbyRoom } from "@port-of-mars/server/rooms/lobby";
import { ChatReport, Incident } from "@port-of-mars/server/entity";
import { BaseService } from "@port-of-mars/server/services/db";
import {
  AdminStats,
  ChatReportData,
  ChatMessageData,
  InspectData,
  IncidentData,
  NONE,
  MUTE,
  IncidentClientData,
  ChatReportRequestData
} from "@port-of-mars/shared/types";
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

  async getChatReports(onlyUnresolved: boolean): Promise<Array<ChatReportData>> {
    const rawReports = await this.em
      .getRepository(ChatReport)
      .createQueryBuilder("report")
      .innerJoinAndSelect("report.game", "game")
      .innerJoinAndSelect("report.user", "user")
      .getMany();
    const reports = rawReports.map((r: ChatReport) => {
      return {
        id: r.id,
        username: r.user.username,
        isBanned: r.user.isBanned,
        isMuted: r.user.isMuted,
        muteStrikes: r.user.muteStrikes,
        roomId: r.game.roomId,
        message: r.message as ChatMessageData,
        resolved: r.resolved,
        dateCreated: r.dateCreated
      }
    });
    return onlyUnresolved ? reports.filter((r: ChatReportData) => !r.resolved) : reports;
  }

  async getIncidents(): Promise<Array<IncidentClientData> | undefined> {
    const incidents = await this.em
      .getRepository(Incident)
      .createQueryBuilder("incident")
      .innerJoinAndSelect("incident.user", "user")
      .innerJoinAndSelect("incident.admin", "admin")
      .where("incident.revoked = :revoked", { revoked: false })
      .andWhere("incident.action != :noneAction", { noneAction: NONE })
      .getMany();
    return incidents.map((i: Incident) => {
      return {
        id: i.id,
        username: i.user.username,
        adminUsername: i.admin.username,
        action: i.action,
        dateExpires: i.dateExpires,
      }
    });
  }

  async submitReport(data: ChatReportRequestData) {
    logger.debug("user in room: %s submitted report for chat message sent by: %s",
      data.roomId, data.username);
    const game = await this.sp.game.findByRoomId(data.roomId);
    const user = await this.sp.account.findByUsername(data.username);
    const message = data.message;
    const repository = this.em.getRepository(ChatReport);
    const report = repository.create({
      game,
      gameId: game.id,
      user,
      userId: user.id,
      message
    });
    await repository.save(report);
  }

  async takeAction(data: IncidentData) {
    const incidentRepo = this.em.getRepository(Incident);
    const reportRepo = this.em.getRepository(ChatReport);
    const report = await reportRepo.findOneOrFail({ id: data.reportId });
    const user = await this.sp.account.findByUsername(data.username);
    const admin = await this.sp.account.findByUsername(data.adminUsername);
    const defaultMuteLength = await this.sp.settings.defaultMuteLength();
    const { username, adminUsername, ...incidentData } = data;
    if (data.action === MUTE) {
     incidentData.muteLength = incidentData.muteLength || defaultMuteLength;
    }
    // submit incident
    const incident = incidentRepo.create({
      report: report,
      user,
      userId: user.id,
      admin,
      adminId: admin.id,
      ...incidentData
    });
    await incidentRepo.save(incident);
    // mark user as muted/banned
    if (data.action !== NONE) {
      this.sp.account.muteOrBanByUsername(data.username, data.action);
    }
    report.resolved = true;
    await reportRepo.save(report);
  }

  async undoAction(data: { incidentId: number, username: string }) {
    const incidentRepo = this.em.getRepository(Incident);
    const reportRepo = this.em.getRepository(ChatReport);
    const incident = await incidentRepo.findOneOrFail({ id: data.incidentId });
    const report = await reportRepo.findOneOrFail({ id: incident.reportId });
    // mark incident as revoked
    incident.revoked = true;
    await incidentRepo.save(incident);
    // unresolve report
    report.resolved = false;
    await reportRepo.save(report);
    // unmute/unban user
    if (incident.action !== NONE) {
      this.sp.account.unmuteOrUnbanByUsername(data.username, incident.action);
    }
  }
}
