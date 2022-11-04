import { Schema, type } from '@colyseus/schema';

export class LobbyRoomState extends Schema {
  constructor() {
    super();
    this.nextAssignmentTime = 0;
    this.waitingUserCount = 0;
    this.isOpen = true;
    this.isLastTry = false;
  }

  @type('number')
  nextAssignmentTime: number;
  // getTime() is a number (date to number) unix

  @type('number')
  waitingUserCount: number;

  @type('boolean')
  isOpen: boolean;

  @type('boolean')
  isLastTry: boolean;
}
