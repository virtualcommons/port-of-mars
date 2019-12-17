import { Room, Client } from "colyseus";
import {WaitingResponses} from "shared/waitingLobby/responses"
import {WaitingRequests} from "shared/waitingLobby/requests";

export class WaitingRoom extends Room{
    welcomeMsg:WaitingResponses = {
        kind:'waiting-lobby',
        message:'youre in the waiting room!'
    }


    onJoin(client:Client, options:any){
        this.send(client,this.welcomeMsg);
    }

    onCreate(){}


    prepareRequest(r: WaitingRequests, client: Client){
        switch(r.kind){
            case 'switch-rooms':
                const roomToGoTo = {
                    kind:'switch-rooms',
                    room:r.room
                }
                this.send(client,roomToGoTo);
                break;
            
        }
    }

    onMessage(client: Client, message: WaitingRequests){
        
        return this.prepareRequest(message,client)
    }
}