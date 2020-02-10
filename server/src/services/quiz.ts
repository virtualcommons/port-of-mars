import { QuizSubmission } from '@/entity/QuizSubmission';
import { Quiz } from '@/entity/Quiz';
import { Question } from '@/entity/Question';
import { QuestionResponse } from '@/entity/QuestionResponse';
import { getConnection } from '@/util';
import { Equal } from 'typeorm';
import * as _ from 'lodash';

export async function checkQuestionResponse(
  questionResponse: QuestionResponse,
  quizId: number
): Promise<boolean> {
  const answer = questionResponse.answer;
  const questionId = questionResponse.questionId;

  const question = await getConnection()
    .getRepository(Question)
    .createQueryBuilder('question')
    .where('question.quizId = :quizId AND question.id = :id', {
      quizId: quizId,
      id: questionId
    })
    .getOne();

  if (answer === question!.correctAnswer) {
    return true;
  }
  return false;
}

export async function createQuestionResponse(
  questionId: number,
  submissionId: number,
  answer: number
): Promise<QuestionResponse> {
  const questionResponse = new QuestionResponse();
  questionResponse.questionId = questionId;
  questionResponse.submissionId = submissionId;
  questionResponse.answer = answer;
  return await getConnection()
    .getRepository(QuestionResponse)
    .save(questionResponse);
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

// TODO: Get most recent submission
export async function getRecentQuizSubmission(
  userId: number
): Promise<QuizSubmission | undefined> {
  return await getConnection()
    .getRepository(QuizSubmission)
    .findOne({
      userId: Equal(userId)
    });
}
