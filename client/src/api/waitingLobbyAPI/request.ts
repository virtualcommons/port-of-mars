import { Room,Client } from 'colyseus.js';
import {
    WaitingRequests,
    SwitchRooms,
} from 'shared/waitingLobby/requests';

export class WaitingRequestAPI{
    constructor(public room: Room){}

    public send(req: WaitingRequests){
        this.room.send(req);
    }

    public joinGame(){
        const msg: SwitchRooms = {kind: 'switch-rooms'};
        this.send(msg);
    }

    public setNextPhase(){
        console.log("this shouldnt run...");
    }
}