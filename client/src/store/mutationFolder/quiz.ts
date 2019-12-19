import { State } from "@/store/state";
import { QuizQuestionData, QuizResultPackage } from "shared/types";

export default {
    SET_QUIZ_QUESTIONS(state:State, payload:Array<QuizQuestionData>){
        state.quizQuestions = payload;
    },
    GET_QUIZ_RESULTS(state:State, payload:Array<QuizResultPackage>){
        state.quizResults = payload;
    }
}