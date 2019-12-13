import { Room, Client } from "colyseus";
import {WaitingResponses} from "shared/waitingLobby/responses"
import {WaitingRequests} from "shared/waitingLobby/requests";

export class WaitingRoom extends Room{
    welcomeMsg:WaitingResponses = {
        kind:'waiting-lobby',
        message:'youre in the waiting room!'
    }

    switchRooms:WaitingResponses = {
        kind:'switch-rooms',
        message:'clear to swtich'
    }

    onJoin(client:Client, options:any){
        this.send(client,this.welcomeMsg);
    }

    onCreate(){}


    prepareRequest(r: WaitingRequests, client: Client){
        switch(r.kind){
            case 'switch-rooms':
                console.log("i made it! ~prepare req");
                // client.leave();
                // client.joinOrCreate('game');
                this.send(client,this.switchRooms);
                break;
            
        }
    }

    onMessage(client: Client, message: WaitingRequests){
        
        return this.prepareRequest(message,client)
    }
}