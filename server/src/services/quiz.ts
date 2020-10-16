import { Question, QuestionResponse, Quiz, QuizSubmission, User } from '@port-of-mars/server/entity';
import { getConnection } from '@port-of-mars/server/util';
import * as _ from 'lodash';
import { BaseService } from "@port-of-mars/server/services/db";
import { getLogger } from "@port-of-mars/server/settings";

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

  async setUserQuizCompletion(userId: number, complete: boolean): Promise<any> {
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

  /**
   * Returns an Array<number> representing all the quiz question IDs that the given user has answered incorrectly for the given quiz.
   * If empty, the user has passed the quiz.
   * @param userId 
   * @param quizId 
   */
  async checkQuizCompletion(userId: number, quizId?: number): Promise<Array<number>> {

    const quiz: Quiz = (quizId) ? await this.getQuizById(quizId, { relations: ['questions'] }) : await this.getDefaultQuiz({ relations: ['questions'] });
    const quizSubmission = await this.getLatestQuizSubmission(userId, quiz.id, { relations: ['responses', 'responses.question'] });
    const questionIds = quiz.questions.map(q => q.id);
    if (! quizSubmission || quizSubmission.responses.length === 0) {
      // the quiz submission does not exist, or it has no responses, so return all question IDs as "incorrect"
      logger.debug("User has not answered any quiz questions yet, send to tutorial");
      return questionIds;
    }
    const quizResponses = quizSubmission.responses;
    // FIXME: look into converting into a single QueryBuilder query
    const correctQuizQuestionIds = new Set<number>();
    for (const quizResponse of quizResponses) {
      const question = quizResponse.question;
      logger.debug("checking quiz response %o from user %d", {quizResponse}, userId);
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