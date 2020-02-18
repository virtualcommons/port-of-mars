import { Schema, type } from '@colyseus/schema';

export class RoomGameState extends Schema {
  constructor() {
    super();
    this.lobbyNextAssignmentTime = 0;
    this.lobbyWaitingUsers = 0;
  }

  @type('number')
  lobbyNextAssignmentTime: number;
  // getTime() is a number (date to number) unix

  @type('number')
  lobbyWaitingUsers: number;
}
