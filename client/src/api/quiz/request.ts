import { Room } from 'colyseus.js';
import { QuizRequests, GradeQuiz } from 'shared/quizLobby/requests';

export class QuizRequestAPI{
    constructor(public room:Room){}

    public send(req: QuizRequests){
        this.room.send(req);
    }

    public submitQuiz(answers:Array<number>){
        const msg: GradeQuiz = {
            kind:'grade-quiz',
            answers
        }
        this.send(msg);
    }
    
}