import { QuizSubmission } from '@/entity/QuizSubmission';
import { Quiz } from '@/entity/Quiz';
import { Question } from '@/entity/Question';
import { QuestionResponse } from '@/entity/QuestionResponse';
import { User } from '@/entity/User';
import { getConnection } from '@/util';
import { Equal } from 'typeorm';
import * as _ from 'lodash';

// NOTE: FUNCTIONS TO CREATE AND SAVE TO DATABASE

export async function createQuizSubmission(
  userId: number,
  quizId: number
): Promise<QuizSubmission | undefined> {
  const quizSubmission = new QuizSubmission();
  quizSubmission.userId = userId;
  quizSubmission.quizId = quizId;
  return await getConnection()
    .getRepository(QuizSubmission)
    .save(quizSubmission);
}

export async function createQuestionResponse(
  questionId: number,
  submissionId: number,
  answer: number
): Promise<QuestionResponse | undefined> {
  const questionResponse = new QuestionResponse();
  questionResponse.questionId = questionId;
  questionResponse.submissionId = submissionId;
  questionResponse.answer = answer;
  return await getConnection()
    .getRepository(QuestionResponse)
    .save(questionResponse);
}

// FUNCTIONS TO GET FROM DATABASE

export async function getQuizByName(name: string): Promise<Quiz | undefined> {
  return await getConnection()
    .getRepository(Quiz)
    .findOne({
      name: Equal(name)
    });
}

export async function getQuizQuestionsByQuizId(
  quizId: number
): Promise<Array<Question> | undefined> {
  return await getConnection()
    .getRepository(Question)
    .find({
      quizId: Equal(quizId)
    });
}

export async function getRecentQuizSubmission(
  userId: number,
  selectedQuiz: string
): Promise<QuizSubmission | undefined> {
  const quiz = await getQuizByName(selectedQuiz);
  if (quiz === undefined) return undefined;
  const quizId = quiz.id;

  return await getConnection()
    .getRepository(QuizSubmission)
    .createQueryBuilder('quizSubmission')
    .where(
      'quizSubmission.quizId = :quizId AND quizSubmission.userId = :userId',
      {
        quizId: quizId,
        userId: userId
      }
    )
    .orderBy('quizSubmission.id', 'DESC')
    .getOne();
}

export async function getQuestionResponsesBySubmissionId(
  submissionId: number
): Promise<Array<QuestionResponse> | undefined> {
  return await getConnection()
    .getRepository(QuestionResponse)
    .find({
      submissionId: Equal(submissionId)
    });
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

export async function checkQuestionResponse(
  questionResponse: QuestionResponse,
  quizId: number
): Promise<boolean> {
  const answer = questionResponse.answer;
  const questionId = questionResponse.questionId;

  const question: Question | undefined = await getConnection()
    .getRepository(Question)
    .createQueryBuilder('question')
    .where('question.quizId = :quizId AND question.id = :id', {
      quizId: quizId,
      id: questionId
    })
    .getOne();

  if (question === undefined) return false;

  if (answer === question!.correctAnswer) {
    return true;
  }
  return false;
}

export async function checkQuizCompletion(
  userId: number,
  selectedQuiz: string
): Promise<boolean> {
  // NOTE: Get QuizSubmission (Recent)
  const quizSubmission = await getRecentQuizSubmission(userId, selectedQuiz);
  if (quizSubmission === undefined) return false;
  const submissionId = quizSubmission.id;

  // NOTE: Get Quiz
  const quiz = await getQuizByName(selectedQuiz);
  if (quiz === undefined) return false;
  const quizId = quiz.id;

  // NOTE: Get QuizQuestions
  const quizQuestions = await getQuizQuestionsByQuizId(quizId);
  if (quizQuestions === undefined) return false;

  // NOTE: Get QuestionResponses
  const questionResponses = await getQuestionResponsesBySubmissionId(
    submissionId
  );
  if (questionResponses === undefined) return false;

  // NOTE: Check if Correct
  if (questionResponses.length < quizQuestions.length) return false;
  for (const question of quizQuestions) {
    const correctResponses = _.filter(
      questionResponses,
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
