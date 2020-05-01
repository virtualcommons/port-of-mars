import { Question, QuestionResponse, Quiz, QuizSubmission, User } from '@port-of-mars/server/entity';
import { getConnection } from '@port-of-mars/server/util';
import { EntityManager } from "typeorm";
import * as _ from 'lodash';
import { BaseService } from "@port-of-mars/server/services/db";

export class QuizService extends BaseService {
  async createQuestionResponse(
    questionId: number,
    submissionId: number,
    answer: number
  ): Promise<QuestionResponse> {
    const questionResponse = new QuestionResponse();
    questionResponse.questionId = questionId;
    questionResponse.submissionId = submissionId;
    questionResponse.answer = answer;
    await this.em.getRepository(QuestionResponse).save(questionResponse);
    questionResponse.question = await this.em.getRepository(Question).findOneOrFail({id: questionId})
    return questionResponse;
  }

  async createQuizSubmission(
    userId: number,
    quizId: number
  ): Promise<QuizSubmission> {
    const quizSubmission = new QuizSubmission();
    quizSubmission.userId = userId;
    quizSubmission.quizId = quizId;
    return await this.em
      .getRepository(QuizSubmission)
      .save(quizSubmission);
  }

  async findQuizSubmission(id: number, opts?: Partial<{ relations: Array<string>; where: object }>): Promise<QuizSubmission | undefined> {
    return this.em.getRepository(QuizSubmission).findOne({ id, ...opts });
  }

  async getDefaultQuiz(opts?: Partial<{ relations: Array<string>; where: object }>): Promise<Quiz> {
    const DEFAULT_QUIZ_NAME = 'TutorialQuiz';
    return await this.getQuizByName(DEFAULT_QUIZ_NAME, opts);
  }

  async getQuizById(id: number, opts?: Partial<{ relations: Array<string>; where: object }>) {
    return await this.em.getRepository(Quiz).findOneOrFail({ id, ...opts });
  }

  async getQuizByName(name: string, opts?: Partial<{ relations: Array<string>; where: object }>): Promise<Quiz> {
    return await getConnection()
      .getRepository(Quiz)
      .findOneOrFail({ name, ...opts });
  }

  async getQuizQuestionsByQuizId(quizId: number): Promise<Array<Question> | undefined> {
    return await this.em
      .getRepository(Question)
      .find({ quizId });
  }

  async getLatestQuizSubmission(
    userId: number,
    quizId: number,
    opts: Partial<{ relations: Array<string>; where: object; order: object }> = {}
  ): Promise<QuizSubmission | undefined> {
    opts = { order: { dateCreated: 'DESC' }, ...opts };
    return await this.em
      .getRepository(QuizSubmission)
      .findOne({ quizId, userId, ...opts });
  }

  async setUserQuizCompletion(
    userId: number,
    complete: boolean
  ): Promise<any> {
    return await this.em
      .createQueryBuilder()
      .update(User)
      .set({ passedQuiz: complete })
      .where('id = :id', { id: userId })
      .execute();
  }

  async findQuestion(id: number): Promise<Question> {
    return await this.em.getRepository(Question).findOneOrFail({ id });
  }

  async isCorrect(questionResponse: QuestionResponse): Promise<boolean> {
    if (! questionResponse.question) {
      const questionId = questionResponse.questionId;
      const question = await this.findQuestion(questionId);
      questionResponse.question = question;
    }
    return questionResponse.answer === questionResponse.question.correctAnswer;
  }

  async checkQuizCompletion(
    userId: number,
    quizId?: number
  ): Promise<boolean> {

    const quiz: Quiz = (quizId) ? await this.getQuizById(quizId, { relations: ['questions'] }) : await this.getDefaultQuiz({ relations: ['questions'] });
    const quizSubmission = await this.getLatestQuizSubmission(userId, quiz.id, { relations: ['responses', 'responses.question'] });
    if (!quizSubmission?.responses) return false;

    const questions = quiz.questions;
    const responses = quizSubmission.responses;

    // check if there are less responses than the total number of quiz questions
    if (responses.length < questions.length) return false;
    // FIXME: this assumes that the client doesn't submit multiple correct responses after they've gotten the answer right.
    const correctResponses = _.filter(responses, (response: QuestionResponse) => response.answer === response.question.correctAnswer);
    if (correctResponses.length === questions.length) {
      this.setUserQuizCompletion(userId, true);
      return true;
    }
    return false;

    /*
    for (const response of responses) {
      if (response.question
    }
    // otherwise iterate through all questions and check for correct responses
    for (const question of questions) {
      const correctResponses = _.filter(
        responses,
        (response: QuestionResponse) => {
          return (
            response.questionId === question.id
            && response.answer === question.correctAnswer
          );
        }
      );
      if (correctResponses.length === 0) {
        return false;
      }
    }
    */
  }
}