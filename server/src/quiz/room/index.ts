import {Room, Client} from 'colyseus';
import {QuizResponses} from 'shared/quizLobby/responses';
import {QuizRequests} from 'shared/quizLobby/requests';


export class QuizRoom extends Room {
    welcomeMsg:QuizResponses = {
        kind:'quiz-lobby',
        message:'welcome to the quiz lobby!'
    }

    onJoin(client:Client, options:any){
        this.send(client,this.welcomeMsg);
    }

    onCreate(){}

    prepareRequest(r: QuizRequests, client: Client){
        switch(r.kind){
            case 'grade-quiz':console.log('grade!'); break;
        }
    }

    onMessage(client: Client, message: QuizRequests){
        return this.prepareRequest(message,client);
    }
}