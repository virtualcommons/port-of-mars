import {
  MemoryEmailer,
  Emailer,
  MailgunEmailer,
} from "@port-of-mars/server/services/email/emailers";
import { LogService, DevLogging, Logging } from "@port-of-mars/server/services/logging";
import { BASE_URL, SERVER_URL_HTTP } from "@port-of-mars/shared/settings";
import * as fs from "fs";

const readSecret = (filename: string): string => {
  return fs.readFileSync(`/run/secrets/${filename}`, "utf8").trim();
};

export interface AppSettings {
  emailer: Emailer;
  host: string;
  serverHost: string;
  logging: Logging;
  secret: string;
  googleAuth: {
    clientId: string;
    clientSecret: string;
  };
  facebookAuth: {
    clientId: string;
    clientSecret: string;
  };
  supportEmail: string;
  isProduction: boolean;
}

const dev: () => AppSettings = () => ({
  emailer: new MemoryEmailer(),
  host: BASE_URL || "http://localhost:8081",
  serverHost: SERVER_URL_HTTP || "http://localhost:2567",
  logging: new DevLogging(),
  secret: readSecret("secret_key"),
  googleAuth: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: readSecret("google_client_secret"),
  },
  facebookAuth: {
    clientId: process.env.FACEBOOK_CLIENT_ID || "",
    clientSecret: readSecret("facebook_client_secret"),
  },
  supportEmail: "portmars@asu.edu",
  isProduction: false,
});

const staging: () => AppSettings = () => {
  const devSettings = dev();
  const mailApiKey = readSecret("mail_api_key");
  const domain = "mg.comses.net";
  return {
    ...devSettings,
    emailer: new MailgunEmailer({ api_key: mailApiKey, domain }),
    host: BASE_URL || "https://staging.portofmars.asu.edu",
    serverHost: BASE_URL || "https://staging.portofmars.asu.edu",
  };
};

const prod: () => AppSettings = () => {
  const stagingSettings = staging();
  return {
    ...stagingSettings,
    host: BASE_URL || "https://portofmars.asu.edu",
    serverHost: BASE_URL || "https://portofmars.asu.edu",
    isProduction: true,
  };
};

function getSettings(): AppSettings {
  const env = process.env.NODE_ENV;
  if (["development", "test"].includes(env || "")) {
    return dev();
  } else if (env === "staging") {
    return staging();
  }
  return prod();
}

export function getLogger(filename: string): LogService {
  return settings.logging.getLogger(filename);
}

export const settings: AppSettings = getSettings();
