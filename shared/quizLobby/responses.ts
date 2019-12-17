import { QuizQuestionData } from 'shared/types';

export interface QuizLobby{
    kind: 'quiz-lobby'
    message:string
    questions: Array<QuizQuestionData>
}

export interface GradeQuiz{
    kind: 'grade-quiz'
    message:string
}

export type QuizResponses = QuizLobby | GradeQuiz;