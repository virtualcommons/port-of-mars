import {MemoryEmailer, Emailer} from "@/services/email/emailers";
import {DevLogging, Logging, LogService} from "@/services/logging";

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

const prod: () => AppSettings = () => ({
  emailer: new MemoryEmailer(),
  host: 'https://portofmars.asu.edu',
  logging: new DevLogging()
});

const env = process.env.NODE_ENV;

export const settings: AppSettings = env === 'development' ?
  dev() : env === 'staging' ?
    staging() : prod();