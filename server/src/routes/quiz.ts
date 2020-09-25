import { NextFunction, Request, Response, Router } from 'express';
import {
  getServices
} from '@port-of-mars/server/services';
import { User } from '@port-of-mars/server/entity/User';
import { settings } from '@port-of-mars/server/settings';
import { ServerError } from '@port-of-mars/server/util';
import { isAuthenticated } from '@port-of-mars/server/routes/middleware';

export const quizRouter = Router();

quizRouter.use(isAuthenticated);

const logger = settings.logging.getLogger(__filename);

// quiz manipulation routes
// endpoints for (1) creating a QuizSubmission and (2) retrieving all quiz questions and the Quiz container 
// that organizes all QuizSubmissions for a particular user

quizRouter.get(
  '/submission/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const quizService = getServices().quiz;
      const user = req.user as User;
      if (user) {
        // FIXME: should have an optional quizId parameter for multiple quiz types
        const id = parseInt(req.params.id);
        let submission = await quizService.findQuizSubmission(id, { where: { userId: user.id }, relations: ['quiz', 'quiz.questions'] });
        let quiz = submission?.quiz;
        let statusCode = 200;
        if (!submission) {
          quiz = await quizService.getDefaultQuiz({ relations: ['questions'] });
          logger.debug('created new submission after looking up id ', id);
          submission = await quizService.createQuizSubmission(user.id, quiz.id);
          statusCode = 201;
        }
        res.status(statusCode).json({ submissionId: submission.id, quizQuestions: quiz!.questions });
      }
    } catch (e) {
      next(e);
    }
  }
);

quizRouter.post(
  '/submission',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const quizService = getServices().quiz;
      const user = req.user as User;
      if (user) {
        const userId = user!.id;
        const quiz = await quizService.getDefaultQuiz({ relations: ['questions'] });
        const quizId = quiz!.id;
        const quizQuestions = quiz.questions;
        const submission = await quizService.createQuizSubmission(userId, quizId);
        const submissionId = submission.id;
        res.status(201).json({ submissionId, quizQuestions });
      }
    } catch (e) {
      next(e);
    }
  }
);

// NOTE: ROUTE FOR CREATING/CHECKING QUESTION RESPONSES
quizRouter.post(
  '/submission/:submissionId/:questionId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const quizService = getServices().quiz;
      const submissionId = parseInt(req.params.submissionId);
      if (isNaN(submissionId)) {
        throw new ServerError({ code: 400, message: `Invalid submission ID ${req.params.submissionId}` });
      }
      const questionId = parseInt(req.params.questionId);
      if (isNaN(questionId)) {
        throw new ServerError({ code: 400, message: `Invalid question ID ${req.params.questionId}` });
      }
      // check answer
      const answer = parseInt(req.body.answer);
      if (isNaN(answer)) {
        throw new ServerError({ code: 400, message: `Invalid quiz response ${req.body.answer}: should have been an integer.` });
      }
      // Create Question Response
      const questionResponse = await quizService.createQuestionResponse(
        questionId,
        submissionId,
        answer
      );
      // check for correctness and notify the client
      const correct = await quizService.isCorrect(questionResponse);
      res.status(200).json(correct);
    }
    catch (e) {
      next(e);
    }
  }
);

// NOTE: ROUTE FOR CHECKING QUIZ COMPLETION

quizRouter.get(
  '/complete',
  async (req: Request, res: Response, next: NextFunction) => {
    // this endpoint should always return an array of numbers representing the incorrect question ids
    try {
      const quizService = getServices().quiz;
      const user = req.user as User;
      // check if the user already passed the quiz
      if (user.passedQuiz) {
        return res.status(200).json([]);
      }

      // otherwise check for quiz completion and notify the client
      const incorrectQuestionIds = await quizService.checkQuizCompletion(user.id);
      return res.status(200).json(incorrectQuestionIds);
    } catch (e) {
      next(e);
    }
  }
);