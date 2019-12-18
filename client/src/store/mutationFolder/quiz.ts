import { State } from "@/store/state";
import { QuizQuestionData } from "shared/types";

export default {
    SET_QUIZ_QUESTIONS(state:State, payload:Array<QuizQuestionData>){
        state.quizQuestions = payload;
    }
}