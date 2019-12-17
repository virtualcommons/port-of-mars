export interface QuizLobby{
    kind: 'quiz-lobby'
    message:string
}

export interface GradeQuiz{
    kind: 'grade-quiz'
    message:string
}

export type QuizResponses = QuizLobby | GradeQuiz;