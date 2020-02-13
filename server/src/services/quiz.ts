import { QuizSubmission } from '@/entity/QuizSubmission';
import { Quiz } from '@/entity/Quiz';
import { Question } from '@/entity/Question';
import { QuestionResponse } from '@/entity/QuestionResponse';
import { getConnection } from '@/util';
import { Equal } from 'typeorm';
import * as _ from 'lodash';

export async function checkQuizCompletion(userId: number): Promise<boolean> {
  // TODO: Set constants
  const DEFAULT_QUIZ = 'TutorialQuiz';
  let error = '';

  // TODO: Get QuizSubmission
  const quizSubmission: QuizSubmission | undefined = await getConnection()
    .getRepository(QuizSubmission)
    .findOne({
      userId: Equal(userId)
    });
  // console.log('QUIZ SUBMISSION: ', quizSubmission);
  if (quizSubmission === undefined) return false;
  const submissionId = quizSubmission.id;

  // TODO: Get Quiz
  const quiz: Quiz | undefined = await getConnection()
    .getRepository(Quiz)
    .findOne({
      name: Equal(DEFAULT_QUIZ)
    });
  // console.log('QUIZ: ', quiz);
  if (quiz === undefined) return false;
  const quizId = quiz.id;

  // TODO: Get number of questions from quiz
  const quizQuestions: Array<Question> | undefined = await getConnection()
    .getRepository(Question)
    .find({
      quizId: Equal(quizId)
    });
  // console.log('QUIZ QUESTIONS: ', quizQuestions);
  if (quizQuestions === undefined) return false;
  const quizQuestionsLength = quizQuestions.length;

  // TODO: Get relevant QuestionResponses
  const questionResponses:
    | Array<QuestionResponse>
    | undefined = await getConnection()
    .getRepository(QuestionResponse)
    .find({
      submissionId: Equal(submissionId)
    });
  // console.log('QUESTION RESPONSES: ', questionResponses);
  if (questionResponses === undefined) return false;
  const questionResponsesLength = questionResponses.length;

  // TODO: Check that all QuestionResponses are correct for all questions
  if (questionResponsesLength < quizQuestionsLength) return false;

  // CONTINUE

  // TODO: Return true/false
  return false;
}

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
