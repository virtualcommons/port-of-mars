import { Schema, type } from '@colyseus/schema';

export class RoomGameState extends Schema {
  constructor() {
    super();
    this.nextAssignmentTime = 0;
    this.waitingUserCount = 0;
  }

  @type('number')
  nextAssignmentTime: number;
  // getTime() is a number (date to number) unix

  @type('number')
  waitingUserCount: number;
}
