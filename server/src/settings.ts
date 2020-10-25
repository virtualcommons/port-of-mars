import { MemoryEmailer, Emailer, MailgunEmailer } from "@port-of-mars/server/services/email/emailers";
import { LogService, DevLogging, Logging } from "@port-of-mars/server/services/logging";
import * as fs from 'fs';

export const SECRET_KEY: string = fs.readFileSync('/run/secrets/secret_key', 'utf8').trim();

export interface AppSettings {
  emailer: Emailer;
  host: string;
  logging: Logging;
  secret: string;
  lobby: LobbySettings;
  supportEmail: string,
  isProduction: boolean;
}

export class LobbySettings {
  constructor(public groupAssignmentInterval: number = 15, public devMode: boolean = true) { }
}

const dev: () => AppSettings = () => ({
  emailer: new MemoryEmailer(),
  host: 'http://localhost:8081',
  logging: new DevLogging(),
  secret: SECRET_KEY,
  supportEmail: 'portmars@asu.edu',
  lobby: new LobbySettings(15),
  isProduction: false,
});

const staging: () => AppSettings = () => {
  const apiKey = fs.readFileSync('/run/secrets/mail_api_key', 'utf-8').trim();
  const domain = 'mg.comses.net';
  return {
    emailer: new MailgunEmailer({ api_key: apiKey, domain }),
    host: 'https://alpha.portofmars.asu.edu',
    logging: new DevLogging(),
    secret: SECRET_KEY,
    supportEmail: 'portmars@asu.edu',
    lobby: new LobbySettings(15),
    isProduction: false,
  };
};

const prod: () => AppSettings = () => {
  const stagingSettings = staging();
  return {
    ...stagingSettings,
    host: 'https://portofmars.asu.edu',
    lobby: new LobbySettings(15, false),
    isProduction: true
  };
};

function getSettings(): AppSettings {
  const env = process.env.NODE_ENV;
  console.log("env: " + env);
  if (['development', 'test'].includes(env || '')) {
    return dev();
  }
  else if (env === 'staging') {
    return staging();
  }
  return prod();
}

export function getLogger(filename: string): LogService {
  return settings.logging.getLogger(filename);
}

export const settings: AppSettings = getSettings();