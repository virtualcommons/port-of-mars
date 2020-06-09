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
  logger = pino(pino.destination('/var/log/port-of-mars/index.log'));

  paths = [
    {
      match: /\/code\/server\/src\/rooms\/game\/events\/.*/,
      level: 'warn'
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
