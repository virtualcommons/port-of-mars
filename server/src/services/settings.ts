import * as util from "util";
import { DynamicSettingsData } from "@port-of-mars/shared/types";
import { RedisClient } from "redis";
import _ from "lodash";
import * as fs from "fs";

export interface AsyncClient {
  hexists: (arg1: string, arg2: string) => Promise<number>;
  hget: (arg1: string, arg2: string) => Promise<string>;
  hgetall: (arg: string) => Promise<{ [p: string]: string }>;
  hset: (arg1: [string, ...Array<string>]) => Promise<number>;
}

function createAsyncClient(client: RedisClient): AsyncClient {
  const hset = util.promisify(client.hset).bind(client);
  const hget = util.promisify(client.hget).bind(client);
  const hgetall = util.promisify(client.hgetall).bind(client);
  const hexists = util.promisify(client.hexists).bind(client);
  return {
    hexists,
    hget,
    hgetall,
    hset,
  };
}

export const DYNAMIC_SETTINGS_PATH = "/run/secrets/settings.json";

export class RedisSettings {
  client: AsyncClient;

  constructor(client: RedisClient) {
    this.client = createAsyncClient(client);
  }

  async loadIfNotExist(path = DYNAMIC_SETTINGS_PATH): Promise<void> {
    if (!(await this.client.hexists("settings", "maxConnections"))) {
      console.log("dynamic settings not found in redis. reloading");
      await this.reload(path);
    }
  }

  async reload(path = DYNAMIC_SETTINGS_PATH): Promise<void> {
    const settings: DynamicSettingsData = JSON.parse(fs.readFileSync(path, "utf8"));
    return await this.setSettings(settings);
  }

  async setSettings(settings: DynamicSettingsData): Promise<void> {
    for (const k of _.keys(settings)) {
      const key = k as keyof DynamicSettingsData;
      await this.client.hset(["settings", key, _.toNumber(settings[key]).toString()]);
    }
  }

  async getSettings(): Promise<DynamicSettingsData> {
    const settings = await this.client.hgetall("settings");
    return {
      maxConnections: _.toNumber(settings.maxConnections),
      defaultDaysMuted: _.toNumber(settings.defaultDaysMuted),
      isTournamentEnabled: !!_.toNumber(settings.isTournamentEnabled),
      isFreePlayEnabled: !!_.toNumber(settings.isFreePlayEnabled),
      tournamentLobbyOpenBeforeOffset: _.toNumber(settings.tournamentLobbyOpenBeforeOffset),
      tournamentLobbyOpenAfterOffset: _.toNumber(settings.tournamentLobbyOpenAfterOffset),
    };
  }

  // display an error message to users connecting to the lobby if more than `maxConnections` clients are connected
  async maxConnections(): Promise<number> {
    return _.toNumber(await this.client.hget("settings", "maxConnections"));
  }

  // length in days that a player will be muted for
  async defaultDaysMuted(): Promise<number> {
    return _.toNumber(await this.client.hget("settings", "defaultDaysMuted"));
  }

  // sign up enabled controls where the user is redirected once their email is verified
  async isTournamentEnabled(): Promise<boolean> {
    return !!_.toNumber(await this.client.hget("settings", "isTournamentEnabled"));
  }

  // enables players to participate as many times as they wish
  async isFreePlayEnabled(): Promise<boolean> {
    return !!_.toNumber(await this.client.hget("settings", "isFreePlayEnabled"));
  }

  // how many minutes before the tournament starts that the lobby will open (min)
  async tournamentLobbyOpenBeforeOffset(): Promise<number> {
    return _.toNumber(await this.client.hget("settings", "tournamentLobbyOpenBeforeOffset"));
  }

  // how many minutes after the tournament starts that the lobby will remain open (min)
  async tournamentLobbyOpenAfterOffset(): Promise<number> {
    return _.toNumber(await this.client.hget("settings", "tournamentLobbyOpenAfterOffset"));
  }

  async report(): Promise<string> {
    const settings = await this.getSettings();
    let report = "";
    for (const k of _.keys(settings)) {
      const key = k as keyof DynamicSettingsData;
      report += `${key}: ${settings[key]}\n`;
    }
    return report;
  }
}
