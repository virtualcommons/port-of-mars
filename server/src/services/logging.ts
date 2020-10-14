import pino, {LogFn} from 'pino';

export interface LogService {
  trace: LogFn;
  debug: LogFn;
  info: LogFn;
  warn: LogFn;
  fatal: LogFn;
}

export interface Logging {
  getLogger(filename: string): LogService;
  enable(): void;
  disable(): void;
}

export class DevLogging implements Logging {
  logger = pino();
  previousLevel = '';

  paths = [
    {
      match: /\/code\/server\/src\/rooms\/game\/events\/.*/,
      level: 'trace'
    },
    {
      match: /.*/,
      level: 'trace'
    }]

  findMatchingLogger(filename: string): LogService {
    for (const path of this.paths) {
      if (path.match.test(filename)) {
        return this.logger.child({filename, level: path.level})
      }
    }
    throw new Error(`couldn't find matching logger in ${this.paths}`);
  }

  getLogger(filename: string): LogService {
    return this.findMatchingLogger(filename);
  }

  disable() {
    this.previousLevel = this.logger.level;
    this.logger.level = 'silent'
  }

  enable() {
    this.logger.level = this.previousLevel;
  }
}
