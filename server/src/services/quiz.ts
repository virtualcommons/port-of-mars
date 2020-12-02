import { Question, QuestionResponse, Quiz, QuizSubmission, User } from '@port-of-mars/server/entity';
import { BaseService } from "@port-of-mars/server/services/db";
import { getLogger } from "@port-of-mars/server/settings";

import * as _ from 'lodash';
import {FindOneOptions} from "typeorm/index";

const logger = getLogger(__filename);

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

  async findQuizSubmission(id: number, opts?: FindOneOptions<QuizSubmission>): Promise<QuizSubmission | undefined> {
    return this.em.getRepository(QuizSubmission).findOne(id, opts);
  }

  async getDefaultQuiz(opts?: FindOneOptions<Quiz>): Promise<Quiz> {
    const DEFAULT_QUIZ_NAME = 'TutorialQuiz';
    return await this.getQuizByName(DEFAULT_QUIZ_NAME, opts);
  }

  async getQuizById(id: number, opts?: FindOneOptions<Quiz>): Promise<Quiz> {
    return await this.em.getRepository(Quiz).findOneOrFail(id, opts);
  }

  async getQuizByName(name: string, opts?: FindOneOptions<Quiz>): Promise<Quiz> {
    return await this.em.getRepository(Quiz).findOneOrFail(_.merge(opts, { where: {name} }));
  }

  async getQuizQuestionsByQuizId(quizId: number): Promise<Array<Question> | undefined> {
    return await this.em.getRepository(Question).find({ where: { quizId } });
  }

  async getLatestQuizSubmission(
    userId: number,
    quizId: number,
    opts: FindOneOptions<QuizSubmission> = {}
  ): Promise<QuizSubmission | undefined> {
    opts = { order: { dateCreated: 'DESC' }, ...opts };
    return await this.em
      .getRepository(QuizSubmission)
      .findOne(_.merge(opts, { where: {quizId, userId} }));
  }

  async setUserQuizCompletion(userId: number, complete: boolean): Promise<any> {
    return await this.em
      .createQueryBuilder()
      .update(User)
      .set({ passedQuiz: complete })
      .where('id = :id', { id: userId })
      .execute();
  }

  async findQuestion(id: number): Promise<Question> {
    return await this.em.getRepository(Question).findOneOrFail(id);
  }

  async isCorrect(questionResponse: QuestionResponse): Promise<boolean> {
    if (! questionResponse.question) {
      const questionId = questionResponse.questionId;
      const question = await this.findQuestion(questionId);
      questionResponse.question = question;
    }
    return questionResponse.answer === questionResponse.question.correctAnswer;
  }

  async getQuizResponses(submissionId: number): Promise<Array<QuestionResponse>> {
    return await this.em.getRepository(QuestionResponse).find({where: { submissionId }, relations: ['question']});
  }

  async getIncompleteQuizUsers(): Promise<Array<User>> {
    return await this.em.getRepository(User).find({where: { passedQuiz: false, isVerified: true }});
  }

  /**
   * Returns an Array<number> representing all the quiz question IDs that the given user has answered incorrectly for the given quiz.
   * If empty, the user has passed the quiz.
   * @param userId 
   * @param quizId 
   */
  async checkQuizCompletion(userId: number, quizId?: number): Promise<Array<number>> {

    const quiz: Quiz = (quizId) ? await this.getQuizById(quizId, { relations: ['questions'] }) : await this.getDefaultQuiz({ relations: ['questions'] });
    const quizSubmission = await this.getLatestQuizSubmission(userId, quiz.id);
    logger.debug("retrieved quiz submission for user %d and quiz %d: %o", userId, quiz.id, quizSubmission);
    const questionIds = quiz.questions.map(q => q.id);
    if (! quizSubmission) {
      // the quiz submission does not exist, or it has no responses, so return all question IDs as "incorrect"
      logger.debug("User has not created a quiz submission yet, should send to tutorial.");
      return questionIds;
    }
    const quizResponses  = await this.getQuizResponses(quizSubmission.id);
    logger.debug("Checking %d responses for user %d (quiz submission %d)", quizResponses.length, userId, quizSubmission.id);
    const correctQuizQuestionIds = new Set<number>();
    for (const quizResponse of quizResponses) {
      const question = quizResponse.question;
      logger.debug("Checking response %d for question %d [%d -> %d]", quizResponse.id, question.id, quizResponse.answer, question.correctAnswer)
      if (quizResponse.answer === question.correctAnswer) {
        correctQuizQuestionIds.add(question.id);
      }
    }
    const incorrectQuestionIds = questionIds.filter(id => ! correctQuizQuestionIds.has(id));
    logger.debug("user %d answered the following questions incorrectly: %o", userId, incorrectQuestionIds);
    await this.setUserQuizCompletion(userId, incorrectQuestionIds.length === 0);
    return incorrectQuestionIds;
  }
}