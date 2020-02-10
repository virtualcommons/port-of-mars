import { QuizQuestions, QuizQuestionAnswers } from '@/data/QuizQuestions';
import { QuizSubmission } from '@/entity/QuizSubmission';
import { Quiz } from '@/entity/Quiz';
import { Question } from '@/entity/Question';
import { getConnection } from '@/util';
import { getUserByUsername } from '@/services/account';
import { Equal } from 'typeorm';

import * as _ from 'lodash';

export function checkQuizQuestion(
  id: number,
  optionSubmitted: number
): boolean {
  const questionIndex = _.findIndex(QuizQuestionAnswers, ['id', id]);
  const correctAnswer = QuizQuestionAnswers[questionIndex].correct;

  if (optionSubmitted === correctAnswer) {
    return true;
  }
  return false;
}

export async function createQuizSubmission(
  userId: number,
  quizId: number
): Promise<QuizSubmission> {
  const quizSubmission = new QuizSubmission();
  quizSubmission.userId = userId;
  quizSubmission.quizId = quizId;
  return await getConnection()
    .getRepository(QuizSubmission)
    .save(quizSubmission);
}

export async function getQuizByName(name: string): Promise<Quiz | undefined> {
  return await getConnection()
    .getRepository(Quiz)
    .findOne({ name });
}

export async function getQuizQuestionsbyQuizId(
  id: number
): Promise<Array<Question> | undefined> {
  return await getConnection()
    .getRepository(Question)
    .find({
      quizId: Equal(id)
    });
}

// GET: authenticate user -> get user id -> get quiz id -> create quiz submission -> send quiz questions
// POST: authenticate user? -> create question response -> save question response into quiz submission
