import pino, { LogFn, Logger } from 'pino';

export interface LogService {
  trace: LogFn
  debug: LogFn
  info: LogFn
  warn: LogFn
  fatal: LogFn
}

export interface Logging {
  getLogger(filename: string): LogService;
}

export class DevLogging implements Logging {
  logger: Logger;

  constructor() {
    this.logger = pino({level: 'trace'});
  }

  getLogger(filename: string): LogService {
    return this.logger;
  }
}
