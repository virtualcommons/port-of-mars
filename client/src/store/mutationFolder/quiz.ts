import { State } from "@/store/state";
import { QuizData } from "shared/types";

export default {
    SET_QUIZ_QUESTIONS(state:State, payload:Array<QuizData>){
        state.quizQuestions = payload;
    }
}