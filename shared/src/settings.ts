type Environment = "development" | "staging" | "production" | "test";

export const ENVIRONMENT = (process.env.NODE_ENV || "development") as Environment;

// client-safe env vars are prefixed with SHARED_
// https://vitejs.dev/guide/env-and-mode.html#env-loading-modes

// client must use import.meta.env to access any value that comes from an environment variable
// instead of process.env or from the settings below
export const settings = {
  ENVIRONMENT: ENVIRONMENT,
  RELEASE_VERSION: process.env.SHARED_RELEASE_VERSION || "version unknown",
  SENTRY_DSN: process.env.SHARED_SENTRY_DSN || "",
  GA_TAG: process.env.SHARED_GA_TAG || "",
  TRAILER_VIDEO_URL: "https://www.youtube.com/embed/CiB4q3CnyCY",
  TUTORIAL_VIDEO_URL: "https://www.youtube.com/embed/D4FfofyrlkA",
  DISCORD_URL: "https://discord.gg/AFEtAJZfEM",
  INSTAGRAM_URL: "https://www.instagram.com/portofmars/",
  TWITTER_URL: "https://twitter.com/PortOfMars",
  GITHUB_URL: "https://github.com/virtualcommons/port-of-mars",
  CONTACT_EMAIL: "portmars@asu.edu",
  GIFT_CARD_AMOUNT: 10,
  SYSTEM_HEALTH_MAINTENANCE_COST: 25,
  MAXIMUM_COST: 1000,
};

const baseUrlMap = {
  development: "http://localhost:8081",
  staging: "https://staging.portofmars.asu.edu",
  production: "https://portofmars.asu.edu",
  test: "http://localhost:8081",
};

export const BASE_URL = baseUrlMap[ENVIRONMENT];
export const SERVER_URL_WS = isDev() ? "ws://localhost:2567" : "";
export const SERVER_URL_HTTP = isDev() ? "http://localhost:2567" : "";

export function isEducatorMode(): boolean {
  // FIXME: APP_MODE is in config.ts temporarily. ideally config.ts can be replaced
  // entirely with an env file
  return (APP_MODE as any) === "educator";
}

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
