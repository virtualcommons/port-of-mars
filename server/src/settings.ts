import { MemoryEmailer, Emailer, MailgunEmailer } from "@port-of-mars/server/services/email/emailers";
import { LogService, DevLogging, Logging } from "@port-of-mars/server/services/logging";
import * as fs from 'fs';

export const SECRET_KEY: string = fs.readFileSync('/run/secrets/jwt', 'utf8').trim();

export interface AppSettings {
  emailer: Emailer;
  host: string;
  logging: Logging;
  secret: string;
  lobby: LobbySettings;
  supportEmail: string,
  allowInternalSurveyRoutes: boolean;
  isProduction: boolean;
}

export class LobbySettings {
  constructor(public evaluateAtEveryMinute: number = 15, public devMode: boolean = true) { }
}

const dev: () => AppSettings = () => ({
  emailer: new MemoryEmailer(),
  host: 'http://localhost:8081',
  logging: new DevLogging(),
  allowInternalSurveyRoutes: true,
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
    allowInternalSurveyRoutes: true,
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
    allowInternalSurveyRoutes: false,
    host: 'https://portofmars.asu.edu',
    lobby: new LobbySettings(15, false),
    isProduction: true
  };
};

const env = process.env.NODE_ENV;

export const settings: AppSettings = ['development', 'test'].includes(env || '') ?
  dev() : env === 'staging' ?
    staging() : prod();

export function getLogger(filename: string): LogService {
  return settings.logging.getLogger(filename);
}