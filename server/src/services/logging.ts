import pino, { LogFn } from "pino";

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
  logger = pino({
    level: "trace",
    transport: {
      target: "pino-pretty",
    },
  });
  previousLevel = "";

  paths = [
    {
      match: /\/code\/server\/src\/rooms\/game\/events\/.*/,
      level: "trace",
    },
    {
      match: /.*/,
      level: "trace",
    },
    {
      match: /\/code\/server\/tests\/.*/,
      level: "info",
    },
  ];

  findMatchingLogger(filename: string): LogService {
    for (const path of this.paths) {
      if (path.match.test(filename)) {
        return this.logger.child({ filename, level: path.level });
      }
    }
    throw new Error(`couldn't find matching logger in ${this.paths}`);
  }

  getLogger(filename: string): LogService {
    return this.findMatchingLogger(filename);
  }

  disable() {
    this.previousLevel = this.logger.level;
    this.logger.level = "silent";
  }

  // FIXME: does this do anything?
  enable() {
    this.logger.level = this.previousLevel;
  }
}
