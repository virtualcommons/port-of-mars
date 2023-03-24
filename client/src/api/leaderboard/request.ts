import { url } from "@port-of-mars/client/util";
import { LeaderboardData, PlayerStatItem } from "@port-of-mars/shared/types";
import { TStore } from "@port-of-mars/client/plugins/tstore";
import { AjaxRequest } from "@port-of-mars/client/plugins/ajax";

export class LeaderboardAPI {
  constructor(public store: TStore, public ajax: AjaxRequest) {}

  async getLeaderboardData(): Promise<LeaderboardData> {
    try {
      return await this.ajax.get(url("/leaderboard"), ({ data }) => {
        return data;
      });
    } catch (e) {
      console.log("Unable to retrieve leaderboard data");
      console.log(e);
      throw e;
    }
  }

  async getPlayerStats(): Promise<Array<PlayerStatItem>> {
    try {
      return await this.ajax.get(url("/leaderboard/stats"), ({ data }) => {
        return data;
      });
    } catch (e) {
      console.log("Unable to retrieve player stats");
      console.log(e);
      throw e;
    }
  }
}
