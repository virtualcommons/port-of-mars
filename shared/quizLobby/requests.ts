export interface GradeQuiz {
    kind: 'grade-quiz'
    answers: Array<number>
}

export type QuizRequests = GradeQuiz