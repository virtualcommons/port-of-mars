import { url } from "@port-of-mars/client/util";
import {
  LeadData,
  GetLeadDataWithBots,
  GetLeadDataWithNoBots,
} from "@port-of-mars/shared/leaderboard/requests";
import { TStore } from "@port-of-mars/client/plugins/tstore";
import { AjaxRequest } from "@port-of-mars/client/plugins/ajax";

export class LeaderboardAPI {
  constructor(public store: TStore, public ajax: AjaxRequest) {}

  async getLeadDataWithBots(): Promise<LeadData> {
    try {
      return await this.ajax.get(url("/lead/data"), ({ data }) => {
        return data;
      });
    } catch (e) {
      console.log("Unable to retrieve lead data with bots");
      console.log(e);
      throw e;
    }
  }

  async getLeadDataWithNoBots() {
    try {
      return await this.ajax.get(url("/lead/data"), ({ data }) => {
        return data;
      });
    } catch (e) {
      console.log("Unable to retrieve lead data with no bots");
      console.log(e);
      throw e;
    }
  }
}
