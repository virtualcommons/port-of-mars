import pino, {LogFn, Logger} from 'pino';
import stream from "stream";

export interface LogService {
  trace: LogFn;
  debug: LogFn;
  info: LogFn;
  warn: LogFn;
  fatal: LogFn;
}

export interface Logging {
  getLogger(filename: string): LogService;
}

export class DevLogging implements Logging {
  logger = pino();

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
}
