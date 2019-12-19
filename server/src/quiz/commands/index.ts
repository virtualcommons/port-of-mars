import { QuizResultPackage } from 'shared/types';
import { QuizQuestionAnswers } from 'src/repositories/QuizQuestions';

// export class SendQuizQuestions {
//     constructor(){}

//     execute(){
//         const questions:QuizResponses = {
//             kind:'quiz-lobby',
//             message:'welcome to the quiz lobby!',
//             questions: QuizQuestions
//         };

//         return questions;
//     }
// }

export class GradeQuiz {
    constructor(private answers:Array<number>){}
    private quizResults:Array<QuizResultPackage> = [];

    execute(){
        this.answers.forEach((val,index)=>{
            const dataEntry:QuizResultPackage = {
                id:QuizQuestionAnswers[index].id,
                userAnswer:val,
                correctAnswer:QuizQuestionAnswers[index].correct,
                correct:val==QuizQuestionAnswers[index].correct
            }
            this.quizResults.push(dataEntry);
        });

        return this.quizResults;
    }
}