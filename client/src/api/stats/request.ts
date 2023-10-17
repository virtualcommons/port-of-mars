import { url } from "@port-of-mars/client/util";
import {
  LeaderboardData,
  PlayerStatItem,
  SoloHighScoreData,
  SoloPlayerStatItem,
} from "@port-of-mars/shared/types";
import { TStore } from "@port-of-mars/client/plugins/tstore";
import { AjaxRequest } from "@port-of-mars/client/plugins/ajax";

export class StatsAPI {
  constructor(public store: TStore, public ajax: AjaxRequest) {}

  async getLeaderboardData(limit?: number): Promise<LeaderboardData> {
    try {
      const params = limit ? `?limit=${limit}` : "";
      return await this.ajax.get(url(`/stats/leaderboard${params}`), ({ data }) => {
        return data;
      });
    } catch (e) {
      console.log("Unable to retrieve leaderboard data");
      console.log(e);
      throw e;
    }
  }

  async getPlayerHistory(): Promise<Array<PlayerStatItem>> {
    try {
      return await this.ajax.get(url("/stats/history"), ({ data }) => {
        return data;
      });
    } catch (e) {
      console.log("Unable to retrieve player game history");
      console.log(e);
      throw e;
    }
  }

  async getSoloHighScoreData(limit?: number): Promise<SoloHighScoreData> {
    try {
      const params = limit ? `?limit=${limit}` : "";
      return await this.ajax.get(url(`/stats/solo/highscores${params}`), ({ data }) => {
        return data;
      });
    } catch (e) {
      console.log("Unable to retrieve solo highscores data");
      console.log(e);
      throw e;
    }
  }

  async getSoloPlayerHistory(): Promise<Array<SoloPlayerStatItem>> {
    try {
      return await this.ajax.get(url("/stats/solo/history"), ({ data }) => {
        return data;
      });
    } catch (e) {
      console.log("Unable to retrieve player solo-game history");
      console.log(e);
      throw e;
    }
  }
}
