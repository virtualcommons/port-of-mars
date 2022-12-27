import { MemoryEmailer, Emailer, MailgunEmailer } from "@port-of-mars/server/services/email/emailers";
import { LogService, DevLogging, Logging } from "@port-of-mars/server/services/logging";
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();


export const SECRET_KEY: string = fs.readFileSync('/run/secrets/secret_key', 'utf8').trim();

export interface AppSettings {
  emailer: Emailer;
  host: string;
  serverHost: string;
  logging: Logging;
  secret: string;
  googleAuth: {
    clientId: string,
    clientSecret: string,
  };
  facebookAuth: {
    clientId: string,
    clientSecret: string,
  };
  supportEmail: string,
  isProduction: boolean;
}

const dev: () => AppSettings = () => ({
  emailer: new MemoryEmailer(),
  host: process.env.BASE_URL || 'http://localhost:8081',
  serverHost: 'http://localhost:2567',
  logging: new DevLogging(),
  secret: SECRET_KEY,
  googleAuth: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },
  facebookAuth: {
    clientId: process.env.FACEBOOK_CLIENT_ID || '',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
  },
  supportEmail: 'portmars@asu.edu',
  isProduction: false,
});

const staging: () => AppSettings = () => {
  const devSettings = dev();
  const apiKey = fs.readFileSync('/run/secrets/mail_api_key', 'utf-8').trim();
  const domain = 'mg.comses.net';
  return {
    ...devSettings,
    emailer: new MailgunEmailer({ api_key: apiKey, domain }),
    host: process.env.BASE_URL || 'https://staging.portofmars.asu.edu',
    serverHost: process.env.BASE_URL || 'https://staging.portofmars.asu.edu',
  };
};

const prod: () => AppSettings = () => {
  const stagingSettings = staging();
  return {
    ...stagingSettings,
    host: process.env.BASE_URL || 'https://portofmars.asu.edu',
    serverHost: process.env.BASE_URL || 'https://portofmars.asu.edu',
    isProduction: true
  };
};

function getSettings(): AppSettings {
  const env = process.env.NODE_ENV;
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
