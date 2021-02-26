export {BUILD_ID} from "./assets/build-id";
export {SENTRY_DSN} from "./assets/sentry-dsn";

const ENVIRONMENT = process.env.NODE_ENV || 'development';

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

export const COST_INAFFORDABLE = 1000;

export const SYSTEM_HEALTH_MAINTENANCE_COST = 25;