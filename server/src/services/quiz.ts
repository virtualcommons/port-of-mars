import {QuizQuestions} from '@/repositories/QuizQuestions'
import { QuizQuestionData } from 'shared/types';

// REFACTOR: db lookup
export function getQuizQuestions(): Array<QuizQuestionData> {
    return QuizQuestions;
}




