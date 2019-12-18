import {Room, Client} from 'colyseus';
import {QuizResponses, ReturnGradedQuiz} from 'shared/quizLobby/responses';
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

    gradeQuiz(client:Client,answers:Array<number>){
        const quizPackage:ReturnGradedQuiz = {
            kind:'graded-quiz',
            quizResults: new GradeQuiz(answers).execute()
        }

        this.send(client, quizPackage);
    }

    onCreate(){}

    prepareRequest(r: QuizRequests, client: Client){
        switch(r.kind){
            case 'grade-quiz':this.gradeQuiz(client,r.answers); break;
        }
    }

    onMessage(client: Client, message: QuizRequests){
        return this.prepareRequest(message,client);
    }
}