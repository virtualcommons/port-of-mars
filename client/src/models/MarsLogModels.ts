interface MarsLogMessage {
  initiator: string;
  category: string;
  content: string;
  time: object;
}

class MarsLogModel {
  private logs: MarsLogMessage[];

  constructor() {
    this.logs = [];
  }

  addEntry(log: MarsLogMessage) {
    this.logs.push(log);
  }

  get marsLog() {
    return this.logs;
  }
}

export { MarsLogModel, MarsLogMessage };
