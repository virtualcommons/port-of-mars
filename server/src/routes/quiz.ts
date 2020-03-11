import { NextFunction, Request, Response, Router } from 'express';
import {
  createQuizSubmission,
  createQuestionResponse,
  getDefaultQuiz,
  findQuizSubmission,
  setUserQuizCompletion,
  checkQuestionResponse,
  checkQuizCompletion
} from '@/services/quiz';
import { User } from '@/entity/User';
import { QuizSubmission } from '@/entity/QuizSubmission';
import { settings } from '@/settings';

export const quizRouter = Router();

const logger = settings.logging.getLogger(__filename);

// quiz manipulation routes
// endpoints for (1) creating a QuizSubmission and (2) retrieving all quiz questions and the Quiz container 
// that organizes all QuizSubmissions for a particular user

function checkUser(req: Request, res: Response) {
  const user = req.user as User | undefined;
  if (!user) {
    logger.debug('No user found on the session: ', req.session);
    res.status(401).json({ error: 'Please login before attempting the tutorial and quiz.' });
    return false;
  }
  return user;
}

quizRouter.get(
  '/submission/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = checkUser(req, res);
      if (user) {
        // FIXME: should have an optional quizId parameter for multiple quiz types
        const id = parseInt(req.params.id);
        let submission = await findQuizSubmission(id, { where: { userId: user.id }, relations: ['quiz', 'quiz.questions'] });
        let quiz = submission?.quiz;
        let statusCode = 200;
        if (!submission) {
          quiz = await getDefaultQuiz({ relations: ['questions'] });
          logger.debug('created new submission after looking up id ', id);
          submission = await createQuizSubmission(user.id, quiz.id);
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
      const user = checkUser(req, res);
      if (user) {
        const userId = user!.id;
        const quiz = await getDefaultQuiz({ relations: ['questions'] });
        const quizId = quiz!.id;
        const quizQuestions = quiz.questions;
        const submission = await createQuizSubmission(userId, quizId);
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
      const submissionId = parseInt(req.params.submissionId);
      if (isNaN(submissionId))
        return res
          .status(400)
          .json({ error: `Invalid submission ID ${req.params.submissionId}` });

      // NOTE: Get Question ID from Params
      const questionId = parseInt(req.params.questionId);
      if (isNaN(questionId))
        return res
          .status(400)
          .json({ error: `Invalid question ID ${req.params.questionId}` });

      // NOTE: Get Answer from Body
      const answer = parseInt(req.body.answer);
      if (isNaN(answer)) {
        return res.status(400).json({ error: `Invalid quiz response ${req.body.answer}: should have been an integer.` });
      }
      // NOTE: Create Question Response
      const questionResponse = await createQuestionResponse(
        questionId,
        submissionId,
        answer
      );
      // NOTE: Check Question Response
      const correct = await checkQuestionResponse(questionResponse);
      // notify the client of the quiz response validation 
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
    try {
      // NOTE: Get User
      const user = req.user as User | undefined;
      if (!user)
        return res.status(401).json({ error: `User not found in session.` });

      // NOTE: Check Database for Completion First
      if (user.passedQuiz) return res.status(200).send(true);

      // NOTE: Check Quiz Completion
      const userId = user.id;
      const complete = await checkQuizCompletion(userId);

      // NOTE: Set User Completion in DB
      await setUserQuizCompletion(userId, complete);

      // NOTE: Send Quiz Completion Status
      res.status(200).send(complete);
    } catch (e) {
      next(e);
    }
  }
);
