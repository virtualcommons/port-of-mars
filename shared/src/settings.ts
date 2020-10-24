export {BUILD_ID} from "./assets/build-id";
export {SENTRY_DSN} from "./assets/sentry-dsn";

export function isDev(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function isDevOrStaging(): boolean {
  return isDev() || isStaging();
}

export function isStagingOrProduction(): boolean {
  return !isDev();
}

export function isStaging(): boolean {
  return process.env.NODE_ENV === 'staging';
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

export const COST_INAFFORDABLE = 1000;

export const SYSTEM_HEALTH_MAINTENANCE_COST = 25;
