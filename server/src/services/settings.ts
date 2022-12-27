import * as util from "util";
import { DynamicSettingsData } from "@port-of-mars/shared/types";
import { RedisClient } from "redis"
import _ from "lodash";
import * as fs from "fs";

export interface AsyncClient {
  hexists: (arg1: string, arg2: string) => Promise<number>,
  hget: (arg1: string, arg2: string) => Promise<string>,
  hgetall: (arg: string) => Promise<{[p: string]: string}>,
  hset: (arg1: [string, ...Array<string>]) => Promise<number>,
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
  }
}

export const DYNAMIC_SETTINGS_PATH = '/run/secrets/settings.json';

export class RedisSettings {
  client: AsyncClient;

  constructor(client: RedisClient) {
    this.client = createAsyncClient(client);
  }

  async loadIfNotExist(path = DYNAMIC_SETTINGS_PATH): Promise<void> {
    if (!(await this.client.hexists('settings', 'maxConnections'))) {
      console.log('dynamic settings not found in redis. reloading')
      await this.reload(path)
    }
  }

  async reload(path = DYNAMIC_SETTINGS_PATH): Promise<void> {
    const settings: DynamicSettingsData = JSON.parse(fs.readFileSync(path, 'utf8'));
    return await this.setSettings(settings);
  }

  async setSettings(settings: DynamicSettingsData): Promise<void> {
    for (const k of _.keys(settings)) {
      const key = k as keyof DynamicSettingsData;
      await this.client.hset(['settings', key, _.toNumber(settings[key]).toString()])
    }
  }

  async getSettings(): Promise<DynamicSettingsData> {
    const settings = await this.client.hgetall('settings');
    return {
      maxConnections: _.toNumber(settings.maxConnections),
      defaultDaysMuted: _.toNumber(settings.defaultDaysMuted),
      isTournamentSignUpEnabled: !!_.toNumber(settings.isTournamentSignUpEnabled),
      isFreePlayEnabled: !!_.toNumber(settings.isFreePlayEnabled),
      isAutoSchedulerEnabled: !!_.toNumber(settings.isAutoSchedulerEnabled),
      autoSchedulerHourInterval: _.toNumber(settings.autoSchedulerHourInterval),
      autoSchedulerDaysOut: _.toNumber(settings.autoSchedulerDaysOut),
      lobbyGroupAssignmentInterval: _.toNumber(settings.lobbyGroupAssignmentInterval),
      lobbyForceGroupAssignmentInterval: _.toNumber(settings.lobbyForceGroupAssignmentInterval),
      lobbyOpenBeforeOffset: _.toNumber(settings.lobbyOpenBeforeOffset),
      lobbyOpenAfterOffset: _.toNumber(settings.lobbyOpenAfterOffset),
    }
  }

  // display an error message to users connecting to the lobby if more than `maxConnections` clients are connected
  async maxConnections(): Promise<number> {
    return _.toNumber(await this.client.hget('settings', 'maxConnections'));
  }

  // length in days that a player will be muted for
  async defaultDaysMuted(): Promise<number> {
    return _.toNumber(await this.client.hget('settings', 'defaultDaysMuted'));
  }

  // sign up enabled controls where the user is redirected once their email is verified
  async isTournamentSignUpEnabled(): Promise<boolean> {
    return !!_.toNumber(await this.client.hget('settings', 'isTournamentSignUpEnabled'));
  }

  // enables players to participate as many times as they wish
  async isFreePlayEnabled(): Promise<boolean> {
    return !!_.toNumber(await this.client.hget('settings', 'isFreePlayEnabled'));
  }

  // whether to run the automatic game scheduler
  async isAutoSchedulerEnabled(): Promise<boolean> {
    return !!_.toNumber(await this.client.hget('settings', 'isAutoSchedulerEnabled'));
  }

  // hours between games that the scheduler will attempt to schedule
  async autoSchedulerHourInterval(): Promise<number> {
    return _.toNumber(await this.client.hget('settings', 'autoSchedulerHourInterval'));
  }

  // number of day in the future that the scheduler will attempt to schedule games for
  async autoSchedulerDaysOut(): Promise<number> {
    return _.toNumber(await this.client.hget('settings', 'autoSchedulerDaysOut'));
  }

  // interval at which the lobby attempts to form groups of 5 players
  async lobbyGroupAssignmentInterval(): Promise<number> {
    return _.toNumber(await this.client.hget('settings', 'lobbyGroupAssignmentInterval'));
  }

  // how much time should pass before a connected player will automatically be assigned to a group w/ bots
  async lobbyForceGroupAssignmentInterval(): Promise<number> {
    return _.toNumber(await this.client.hget('settings', 'lobbyForceGroupAssignmentInterval'));
  }

  // minutes BEFORE scheduled time that the lobby will be open for
  async lobbyOpenBeforeOffset(): Promise<number> {
    return _.toNumber(await this.client.hget('settings', 'lobbyOpenBeforeOffset'));
  }

  // minutes AFTER scheduled time that the lobby will be open for
  async lobbyOpenAfterOffset(): Promise<number> {
    return _.toNumber(await this.client.hget('settings', 'lobbyOpenAfterOffset'));
  }

  async report(): Promise<string> {
    const settings = await this.getSettings();
    let report = '';
    for (const k of _.keys(settings)) {
      const key = k as keyof DynamicSettingsData;
      report += `${key}: ${settings[key]}\n`
    }
    return report;
  }
}