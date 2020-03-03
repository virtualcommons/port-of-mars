import {MemoryEmailer, Emailer, MailgunEmailer} from "@/services/email/emailers";
import {DevLogging, Logging, LogService} from "@/services/logging";
import * as fs from 'fs';

export interface AppSettings {
  emailer: Emailer
  host: string
  logging: Logging
}

const dev: () => AppSettings = () => ({
  emailer: new MemoryEmailer(),
  host: 'http://localhost:8081',
  logging: new DevLogging()
});

const staging: () => AppSettings = () => ({
  emailer: new MemoryEmailer(),
  host: 'http://localhost:8081',
  logging: new DevLogging()
});

const prod: () => AppSettings = () => (
  const api_key = fs.readFileSync('/run/secrets/mail_api_key', 'utf-8').trim();
  const domain = 'mg.comses.net';
  return {
    emailer: new MailgunEmailer({ api_key, domain}),
    host: 'https://portofmars.asu.edu'
    logging: new DevLogging()
  };
});

const env = process.env.NODE_ENV;

export const settings: AppSettings = env === 'development' ?
  dev() : env === 'staging' ?
    staging() : prod();
