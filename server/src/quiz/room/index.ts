import {Room, Client} from 'colyseus';
import {QuizResponses} from 'shared/quizLobby/responses';
import {QuizRequests} from 'shared/quizLobby/requests';
import { QuizQuestions } from '@/repositories/QuizQuestions';
import {GradeQuiz} from '../commands/index';

export class QuizRoom extends Room {
    private welcomeMsg:QuizResponses = {
        kind:'quiz-lobby',
        message:'welcome to the quiz lobby!',
        questions:QuizQuestions,
    }

    onJoin(client:Client, options:any){
        this.send(client,this.welcomeMsg);
    }

    onCreate(){}

    prepareRequest(r: QuizRequests, client: Client){
        switch(r.kind){
            case 'grade-quiz':new GradeQuiz(r.answers).execute(); console.log('grade!'); break;
        }
    }

    onMessage(client: Client, message: QuizRequests){
        return this.prepareRequest(message,client);
    }
}