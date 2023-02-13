import { Schema, type } from "@colyseus/schema";
import { ChatMessageData, MarsLogMessageData, Role, ServerRole } from "@port-of-mars/shared/types";
import _ from "lodash";

export class ChatMessage extends Schema implements ChatMessageData {
  constructor(msg: ChatMessageData) {
    super();
    this.role = msg.role;
    this.message = msg.message;
    this.dateCreated = msg.dateCreated;
    this.round = msg.round;
  }

  fromJSON(data: ChatMessageData): void {
    Object.assign(this, data);
  }

  toJSON(): ChatMessageData {
    return {
      role: this.role,
      message: this.message,
      dateCreated: this.dateCreated,
      round: this.round,
    };
  }

  @type("string")
  role: string;

  @type("string")
  message: string;

  @type("number")
  dateCreated: number;

  @type("number")
  round: number;
}

export class MarsLogMessage extends Schema implements MarsLogMessageData {
  constructor(msg: MarsLogMessageData) {
    super();
    this.round = msg.round;
    this.performedBy = msg.performedBy;
    this.category = msg.category;
    this.content = msg.content;
    this.timestamp = msg.timestamp;
    this.id = msg.id;
  }

  fromJSON(data: MarsLogMessageData): void {
    Object.assign(this, data);
  }

  toJSON(): MarsLogMessageData {
    return {
      round: this.round,
      performedBy: this.performedBy,
      category: this.category,
      content: this.content,
      timestamp: this.timestamp,
      id: this.id,
    };
  }

  @type("number")
  round: number;

  @type("string")
  performedBy: Role | ServerRole;

  @type("string")
  category: string;

  @type("string")
  content: string;

  @type("number")
  timestamp: number;

  @type("number")
  id: number;
}
