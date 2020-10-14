import * as util from "util";
import {RedisClient} from "redis"
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

export interface SettingsData {
  maxConnections: number
}

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

  async reload(path = DYNAMIC_SETTINGS_PATH): Promise<number> {
    const settings: SettingsData = JSON.parse(fs.readFileSync(path, 'utf8'));
    return await this.setSettings(settings);
  }

  async setSettings(settings: SettingsData): Promise<number> {
    // FIXME: this should set all settings from the file and replace server/settings
    return await this.client.hset(['settings', 'maxConnections', settings.maxConnections.toString()])
  }

  async getMaxConnections(): Promise<number> {
    return _.toNumber(await this.client.hget('settings', 'maxConnections'));
  }
}