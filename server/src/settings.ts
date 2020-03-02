import {MemoryEmailer, Emailer} from "@/services/email/emailers";

export interface AppSettings {
  emailer: Emailer
  host: string
}

const dev: AppSettings = {
  emailer: new MemoryEmailer(),
  host: 'http://localhost:8081'
};

const staging = {
  emailer: new MemoryEmailer(),
  host: 'http://localhost:8081'
};

const prod = {
  emailer: new MemoryEmailer(),
  host: 'https://portofmars.asu.edu'
};

const env = process.env.NODE_ENV;

export const settings = env === 'development' ?
  dev : env === 'staging' ?
    staging : prod;