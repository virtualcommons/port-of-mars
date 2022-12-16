import { url } from "@port-of-mars/client/util";
import { AdminStats, ChatReportData, ModerationActionClientData, ModerationActionData, InspectData } from "@port-of-mars/shared/types";
import { TStore } from "@port-of-mars/client/plugins/tstore";
import { AjaxRequest } from "@port-of-mars/client/plugins/ajax";

export class AdminAPI {
  constructor(public store: TStore, public ajax: AjaxRequest) {}

  async getAdminStats(): Promise<AdminStats> {
    try {
      return await this.ajax.get(url("/admin/stats"), ({ data, status }) => {
        return data;
      });
    } catch (e) {
      console.log("Unable to retrieve admin stats");
      console.log(e);
      throw e;
    }
  }

  async getActiveRooms(): Promise<any> {
    try {
      return await this.ajax.get(url("/admin/rooms"), ({ data, status }) => {
        return data;
      });
    } catch (e) {
      console.log("Unable to retrieve active rooms");
      console.log(e);
      throw e;
    }
  }

  async getLobbyData(): Promise<any> {
    try {
      return await this.ajax.get(url("/admin/lobby"), ({ data, status }) => {
        return data;
      });
    } catch (e) {
      console.log("Unable to retrieve lobby data");
      console.log(e);
      throw e;
    }
  }

  async getInspectData(roomId: string): Promise<InspectData> {
    try {
      return await this.ajax.get(url("/admin/room?roomId=" + roomId), ({ data, status }) => {
        return data;
      });
    } catch (e) {
      console.log("Unable to retrieve room state");
      console.log(e);
      throw e;
    }
  }

  async getUnresolvedChatReports(): Promise<Array<ChatReportData>> {
    try {
      return await this.ajax.get(url("/admin/chat-reports?onlyUnresolved=true"), ({ data, status }) => {
        return data;
      });
    } catch (e) {
      console.log("Unable to retrieve chat reports");
      console.log(e);
      throw e;
    }
  }

  async getModerationActions(): Promise<Array<ModerationActionClientData>> {
    try {
      return await this.ajax.get(url("/admin/moderation-actions"), ({ data, status }) => {
        return data;
      });
    } catch (e) {
      console.log("Unable to retrieve moderation actions");
      console.log(e);
      throw e;
    }
  }

  async getBannedUsers(): Promise<Array<string>> {
    try {
      return await this.ajax.get(url("/admin/banned-users"), ({ data, status }) => {
        return data;
      });
    } catch (e) {
      console.log("Unable to retrieve banned users");
      console.log(e);
      throw e;
    }
  }

  async takeModerationAction(data: ModerationActionData, success: () => void): Promise<void> {
    try {
      await this.ajax.post(url("/admin/take-moderation-action"), ({ data, status }) => {
          if (status === 200) success();
        }, data);
    } catch (e) {
      console.log("Unable to submit chat report resolution");
      console.log(e);
      throw e;
    }
  }

  async undoModerationAction(data: { moderationActionId: number, username: string }, success: () => void): Promise<void> {
    try {
      await this.ajax.post(url("/admin/undo-moderation-action"), ({ data, status }) => {
          if (status === 200) success();
        }, data);
    } catch (e) {
      console.log("Unable to undo action");
      console.log(e);
      throw e;
    }
  }
}
