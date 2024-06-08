type Environment = "development" | "staging" | "production" | "test";

export const ENVIRONMENT = (process.env.NODE_ENV || "development") as Environment;
export const RELEASE_VERSION = process.env.RELEASE_VERSION || "unknown";
export const SENTRY_DSN = process.env.SENTRY_DSN || "";
export const GA_TAG = process.env.GA_TAG || "";

const baseUrlMap = {
  development: "http://localhost:8081",
  staging: "https://staging.portofmars.asu.edu",
  production: "https://portofmars.asu.edu",
  test: "http://localhost:8081",
};

export const BASE_URL = baseUrlMap[ENVIRONMENT];
export const SERVER_URL_WS = isDev() ? "ws://localhost:2567" : "";
export const SERVER_URL_HTTP = isDev() ? "http://localhost:2567" : "";

export function isDev(): boolean {
  return ENVIRONMENT === "development";
}

export function isStaging(): boolean {
  return ENVIRONMENT === "staging";
}

export function isProduction(): boolean {
  return ENVIRONMENT === "production";
}

export function isTest(): boolean {
  return ENVIRONMENT === "test";
}

export function isDevOrStaging(): boolean {
  return isDev() || isStaging();
}

export function isStagingOrProduction(): boolean {
  return isStaging() || isProduction();
}

export class Constants {
  // FIXME: this is rather cumbersome to use, rather just export consts directly
  // also consider putting some of these in .env config
  public static readonly TRAILER_VIDEO_URL = "https://www.youtube.com/embed/CiB4q3CnyCY";
  public static readonly TUTORIAL_VIDEO_URL = "https://www.youtube.com/embed/D4FfofyrlkA";
  public static readonly DISCORD_URL = "https://discord.gg/AFEtAJZfEM";
  public static readonly INSTAGRAM_URL = "https://www.instagram.com/portofmars/";
  public static readonly TWITTER_URL = "https://twitter.com/PortOfMars";
  public static readonly GITHUB_URL = "https://github.com/virtualcommons/port-of-mars";
  public static readonly CONTACT_EMAIL = "portmars@asu.edu";
  public static readonly ENVIRONMENT = ENVIRONMENT;
  public static readonly RELEASE_VERSION = RELEASE_VERSION;
  public static readonly SENTRY_DSN = SENTRY_DSN;
  public static readonly GA_TAG = GA_TAG;
  public static readonly GIFT_CARD_AMOUNT = 10;
  public static readonly SYSTEM_HEALTH_MAINTENANCE_COST = 25;
  public static readonly MAXIMUM_COST = 1000;
}
