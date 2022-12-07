import { url } from "@port-of-mars/client/util";
import { AdminStats, ChatReportData, InspectData } from "@port-of-mars/shared/types";
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

  async getChatReports(): Promise<Array<ChatReportData>> {
    try {
      return await this.ajax.get(url("/admin/chat-reports"), ({ data, status }) => {
        return data;
      });
    } catch (e) {
      console.log("Unable to retrieve chat reports");
      console.log(e);
      throw e;
    }
  }
}
