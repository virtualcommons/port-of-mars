import { matchMaker } from "colyseus";
import { GameRoom } from "@port-of-mars/server/rooms/game";
import { FreePlayLobbyRoom } from "@port-of-mars/server/rooms/lobby/freeplay";
import { ChatReport, ModerationAction } from "@port-of-mars/server/entity";
import { BaseService } from "@port-of-mars/server/services/db";
import {
  AdminStats,
  ChatReportData,
  ChatMessageData,
  InspectData,
  ModerationActionData,
  NONE,
  MUTE,
  ModerationActionClientData,
  ChatReportRequestData,
  ModerationActionType,
  LobbyActivityData,
} from "@port-of-mars/shared/types";
import { getLogger } from "@port-of-mars/server/settings";
import { TournamentLobbyRoom } from "../rooms/lobby/tournament";

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
    };
  }

  async getLobbyData(): Promise<LobbyActivityData> {
    return {
      freeplay: await matchMaker.query({ name: FreePlayLobbyRoom.NAME }),
      tournament: await matchMaker.query({ name: TournamentLobbyRoom.NAME }),
    };
  }

  async getActiveRooms(): Promise<any> {
    const games = await matchMaker.query({ name: GameRoom.NAME });
    return games.map((g: any) => {
      return {
        roomId: g.roomId,
        clients: g.clients,
        elapsed: Date.now() - new Date(g.createdAt).getTime(),
        type: g.type,
      };
    });
  }

  async getInspectData(roomId: string): Promise<InspectData | undefined> {
    if (roomId && (await matchMaker.query({ roomId }))) {
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
        dateCreated: r.dateCreated,
      };
    });
    return onlyUnresolved ? reports.filter((r: ChatReportData) => !r.resolved) : reports;
  }

  async getModerationActions(): Promise<Array<ModerationActionClientData>> {
    const moderationActions = await this.em
      .getRepository(ModerationAction)
      .createQueryBuilder("moderationAction")
      .innerJoinAndSelect("moderationAction.user", "user")
      .innerJoinAndSelect("moderationAction.admin", "admin")
      .where("moderationAction.revoked = :revoked", { revoked: false })
      .andWhere("moderationAction.action != :noneAction", { noneAction: NONE })
      .getMany();
    return moderationActions.map((i: ModerationAction) => {
      return {
        id: i.id,
        username: i.user.username,
        adminUsername: i.admin.username,
        action: i.action,
        dateMuteExpires: i.dateMuteExpires,
      };
    });
  }

  async submitChatReport(data: ChatReportRequestData) {
    logger.debug(
      "user in room: %s submitted report for chat message sent by: %s",
      data.roomId,
      data.username
    );
    const game = await this.sp.game.findByRoomId(data.roomId);
    const user = await this.sp.account.findByUsername(data.username);
    const message = data.message;
    const repository = this.em.getRepository(ChatReport);
    const report = repository.create({
      game,
      gameId: game.id,
      user,
      userId: user.id,
      message,
    });
    await repository.save(report);
  }

  async takeModerationAction(data: ModerationActionData) {
    const moderationActionRepo = this.em.getRepository(ModerationAction);
    const reportRepo = this.em.getRepository(ChatReport);
    const report = await reportRepo.findOneByOrFail({ id: data.reportId });
    const user = await this.sp.account.findByUsername(data.username);
    const admin = await this.sp.account.findByUsername(data.adminUsername);
    const { username, adminUsername, ...moderationActionData } = data;
    if (data.action === MUTE && moderationActionData.daysMuted === undefined) {
      moderationActionData.daysMuted = await this.sp.settings.defaultDaysMuted();
    }
    // submit moderationAction
    const moderationAction = moderationActionRepo.create({
      report: report,
      user,
      userId: user.id,
      admin,
      adminId: admin.id,
      ...moderationActionData,
    });
    await moderationActionRepo.save(moderationAction);
    // mark user as muted/banned
    if (data.action !== NONE) {
      await this.sp.account.muteOrBanByUsername(data.username, data.action);
    }
    report.resolved = true;
    await reportRepo.save(report);
  }

  async hasActiveModerationAction(
    username: string,
    action: ModerationActionType
  ): Promise<boolean> {
    const activeModerationActions = await this.em
      .getRepository(ModerationAction)
      .createQueryBuilder("moderationAction")
      .innerJoinAndSelect("moderationAction.user", "user")
      .where("moderationAction.revoked = :revoked", { revoked: false })
      .andWhere("moderationAction.action = :action", { action })
      .andWhere("user.username = :username", { username })
      .getMany();
    if (action === MUTE) {
      return activeModerationActions.some((i: ModerationAction) => i.dateMuteExpires > new Date());
    } else {
      return activeModerationActions.length > 0;
    }
  }

  async undoModerationAction(data: { moderationActionId: number; username: string }) {
    const moderationActionRepo = this.em.getRepository(ModerationAction);
    const reportRepo = this.em.getRepository(ChatReport);
    const moderationAction = await moderationActionRepo.findOneByOrFail({
      id: data.moderationActionId,
    });
    const report = await reportRepo.findOneByOrFail({ id: moderationAction.reportId });
    // mark moderationAction as revoked
    moderationAction.revoked = true;
    await moderationActionRepo.save(moderationAction);
    // unresolve report
    report.resolved = false;
    await reportRepo.save(report);
    // unmute/unban user if they have no other active actions
    if (moderationAction.action !== NONE) {
      if (!(await this.hasActiveModerationAction(data.username, moderationAction.action))) {
        await this.sp.account.unmuteOrUnbanByUsername(data.username, moderationAction.action);
      } else if (moderationAction.action === MUTE) {
        await this.sp.account.decrementMuteStrikes(data.username);
      }
    }
  }

  async unapplyExpiredMutes() {
    const expiredMuteActions = await this.em
      .getRepository(ModerationAction)
      .createQueryBuilder("moderationAction")
      .innerJoinAndSelect("moderationAction.user", "user")
      .where("moderationAction.revoked = :revoked", { revoked: false })
      .andWhere("moderationAction.action = :muteAction", { muteAction: MUTE })
      .andWhere("moderationAction.dateMuteExpires < :now", { now: new Date() })
      .getMany();
    for (const action of expiredMuteActions) {
      logger.trace("mute [%d] for user (%s) has expired", action.id, action.user.username);
      if (!(await this.hasActiveModerationAction(action.user.username, MUTE))) {
        await this.sp.account.expireMute(action.user.username);
      }
    }
  }
}
