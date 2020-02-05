import {QuizQuestions} from '@/data/QuizQuestions'
import { QuizQuestionData } from 'shared/types';

// REFACTOR: db lookup
export function getQuizQuestions(): Array<QuizQuestionData> {
    return QuizQuestions;
}




