import { QuizQuestionData, QuizResultPackage } from 'shared/types';

export interface QuizLobby{
    kind: 'quiz-lobby'
    message:string
    questions: Array<QuizQuestionData>
}

export interface GradeQuiz{
    kind: 'grade-quiz'
    message:string
}

export interface ReturnGradedQuiz{
    kind: 'graded-quiz'
    quizResults: Array<QuizResultPackage>
}

export type QuizResponses = QuizLobby | GradeQuiz | ReturnGradedQuiz;