import { Room, Client } from "colyseus";


export class QuizRoom extends Room{
    onJoin(client:Client, options:any){
        this.send(client,{message:"hello!"});
    }
}