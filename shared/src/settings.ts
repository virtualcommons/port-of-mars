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