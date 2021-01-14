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
  // display an error message to users connecting to the lobby if more than `maxConnections` clients are connected
  maxConnections: number
  // sign up enabled controls where the user is redirected once their email is verified
  isSignUpEnabled: boolean
  // if true, set all checks to true (isVerified, passedQuiz, completed intro and exit surveys), otherwise only bypass isVerified
  skipDevUserChecks: boolean
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

  async reload(path = DYNAMIC_SETTINGS_PATH): Promise<void> {
    const settings: SettingsData = JSON.parse(fs.readFileSync(path, 'utf8'));
    return await this.setSettings(settings);
  }

  async setSettings(settings: SettingsData): Promise<void> {
    for (const k of _.keys(settings)) {
      const key = k as keyof SettingsData;
      await this.client.hset(['settings', key, _.toNumber(settings[key]).toString()])
    }
  }

  async maxConnections(): Promise<number> {
    return _.toNumber(await this.client.hget('settings', 'maxConnections'));
  }

  async isSignUpEnabled(): Promise<boolean> {
    return !!_.toNumber(await this.client.hget('settings', 'isSignUpEnabled'))
  }
}