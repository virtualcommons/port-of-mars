import { QuizSubmission } from '@/entity/QuizSubmission';
import { Quiz } from '@/entity/Quiz';
import { Question } from '@/entity/Question';
import { QuestionResponse } from '@/entity/QuestionResponse';
import { User } from '@/entity/User';
import { getConnection } from '@/util';
import * as _ from 'lodash';

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

export async function findQuizSubmission(id: number, opts?: Partial<{ relations: Array<string>, where: object }>): Promise<QuizSubmission | undefined> {
  return getConnection().getRepository(QuizSubmission).findOne({ id, ...opts });
}

// FUNCTIONS TO GET FROM DATABASE
export async function getDefaultQuiz(opts?: Partial<{ relations: Array<string>, where: object }>): Promise<Quiz> {
  const DEFAULT_QUIZ_NAME = 'TutorialQuiz';
  return await getQuizByName(DEFAULT_QUIZ_NAME, opts);
}

export async function getQuizById(id: number, opts?: Partial<{ relations: Array<string>, where: object }>) {
  return await getConnection().getRepository(Quiz).findOneOrFail({ id, ...opts });
}

export async function getQuizByName(name: string, opts?: Partial<{ relations: Array<string>, where: object }>): Promise<Quiz> {
  return await getConnection()
    .getRepository(Quiz)
    .findOneOrFail({ name, ...opts });
}

export async function getQuizQuestionsByQuizId(quizId: number): Promise<Array<Question> | undefined> {
  return await getConnection()
    .getRepository(Question)
    .find({ quizId });
}

export async function getRecentQuizSubmission(
  userId: number,
  quizId: number,
  opts: Partial<{ relations: Array<string>, where: object, order: object }> = {}
): Promise<QuizSubmission | undefined> {
  opts = { order: { dateCreated: 'DESC' }, ...opts };
  return await getConnection()
    .getRepository(QuizSubmission)
    .findOne({ quizId, userId, ...opts });
}

export async function getQuestionResponsesBySubmissionId(
  submissionId: number
): Promise<Array<QuestionResponse> | undefined> {
  return await getConnection()
    .getRepository(QuestionResponse)
    .find({ submissionId });
}

// FUNCTIONS TO UPDATE DATABASE

export async function setUserQuizCompletion(
  userId: number,
  complete: boolean
): Promise<any> {
  return await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({ passedQuiz: complete })
    .where('id = :id', { id: userId })
    .execute();
}

// NOTE: FUNCTIONS TO CHECK FROM DATABASE

export async function findQuestion(id: number): Promise<Question | undefined> {
  return await getConnection().getRepository(Question).findOne({id});
}

export async function checkQuestionResponse(questionResponse: QuestionResponse): Promise<boolean> {
  const answer = questionResponse.answer;
  const questionId = questionResponse.questionId;
  const question = await findQuestion(questionId);
  if (question === undefined) return false;
  return answer === question.correctAnswer;
}

export async function checkQuizCompletion(
  userId: number,
  quizId?: number
): Promise<boolean> {

  let quiz: Quiz = (quizId) ? await getQuizById(quizId, { relations: ['questions'] }) : await getDefaultQuiz();
  const quizSubmission = await getRecentQuizSubmission(userId, quiz.id, { relations: ['responses'] });
  if (!quizSubmission?.responses) return false;

  const questions = quiz.questions;
  const responses = quizSubmission.responses;

  // check if responses are same length as number of questions
  if (responses.length < questions.length) return false;
  for (const question of questions) {
    const correctResponses = _.filter(
      responses,
      (response: QuestionResponse) => {
        return (
          response.questionId === question.id &&
          response.answer === question.correctAnswer
        );
      }
    );
    if (correctResponses.length === 0) {
      return false;
    }
  }
  return true;
}