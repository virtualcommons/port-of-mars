import { url } from "@port-of-mars/client/util";
import { AdminStats, ChatReportData } from "@port-of-mars/shared/types";
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
      console.log("Unable to retrieve AdminData");
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
      console.log("Unable to retrieve ChatReports");
      console.log(e);
      throw e;
    }
  }
}
