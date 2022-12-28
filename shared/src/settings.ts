import { BUILD_ID, SENTRY_DSN } from "./assets/config";
export { BUILD_ID, SENTRY_DSN } from "./assets/config";

export const ENVIRONMENT = process.env.NODE_ENV || 'development';

export function isDev(): boolean {
  return ENVIRONMENT === 'development';
}

export function isStaging(): boolean {
  return ENVIRONMENT === 'staging';
}

export function isProduction(): boolean {
  return ENVIRONMENT === 'production';
}

export function isTest(): boolean {
  return ENVIRONMENT === 'test';
}

export function isDevOrStaging(): boolean {
  return isDev() || isStaging();
}

export function isStagingOrProduction(): boolean {
  return isStaging() || isProduction();
}

export class Constants {
  // FIXME: we could support reading values from a settings file as well/instead?
  public static readonly TRAILER_VIDEO_URL = "https://www.youtube.com/embed/CiB4q3CnyCY";
  public static readonly TUTORIAL_VIDEO_URL = "https://www.youtube.com/embed/D4FfofyrlkA";
  public static readonly DISCORD_URL = "https://discord.gg/AFEtAJZfEM";
  public static readonly INSTAGRAM_URL = "https://www.instagram.com/portofmars/";
  public static readonly TWITTER_URL = "https://twitter.com/PortOfMars";
  public static readonly GITHUB_URL = "https://github.com/virtualcommons/port-of-mars";
  public static readonly CONTACT_EMAIL = "portmars@asu.edu";
  public static readonly ENVIRONMENT = ENVIRONMENT;
  public static readonly BUILD_ID = BUILD_ID;
  public static readonly SENTRY_DSN = SENTRY_DSN;
  public static readonly GIFT_CARD_AMOUNT = 10;
  public static readonly SYSTEM_HEALTH_MAINTENANCE_COST = 25;
  public static readonly MAXIMUM_COST = 1000;
}
