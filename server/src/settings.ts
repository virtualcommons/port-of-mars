import {MemoryEmailer, Emailer} from "@/services/email/emailers";

export interface AppSettings {
  emailer: Emailer
  host: string
}

const dev: () => AppSettings = () => ({
  emailer: new MemoryEmailer(),
  host: 'http://localhost:8081'
});

const staging: () => AppSettings = () => ({
  emailer: new MemoryEmailer(),
  host: 'http://localhost:8081'
});

const prod: () => AppSettings = () => ({
  emailer: new MemoryEmailer(),
  host: 'https://portofmars.asu.edu'
});

const env = process.env.NODE_ENV;

export const settings: AppSettings = env === 'development' ?
  dev() : env === 'staging' ?
    staging() : prod();