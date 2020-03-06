import { NextFunction, Request, Response, Router } from 'express';
import {
  createQuizSubmission,
  createQuestionResponse,
  getQuizByName,
  getQuizQuestionsByQuizId,
  setUserQuizCompletion,
  checkQuestionResponse,
  checkQuizCompletion
} from '@/services/quiz';
import { User } from "@/entity/User";
import { settings } from '@/settings';

export const quizRouter = Router();

const logger = settings.logging.getLogger(__filename);

const DEFAULT_QUIZ = 'TutorialQuiz';

// NOTE: ROUTE FOR CREATING A QUIZ SUBMISSION

quizRouter.post(
  '/create',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // NOTE: Get User ID
      const user = req.user as User | undefined;
      if (! user) {
        logger.fatal('No user found on request with session id: ', req.sessionID);
        return res.status(500).send(`User not found with provided JWT.`);
      }
      const userId = user!.id;

      // NOTE: Get Quiz ID
      const quiz = await getQuizByName(DEFAULT_QUIZ);
      if (quiz === undefined)
        return res.status(500).send('Database Failure: Failed to get Quiz.');
      const quizId = quiz!.id;

      // NOTE: Create QuizSubmission
      const submission = await createQuizSubmission(userId, quizId);
      if (submission === undefined)
        return res
          .status(500)
          .send('Database Failure: Failed to create QuizSubmission.');
      const submissionId = submission!.id;

      // NOTE: Send Submission Information
      res.status(201).send({ submissionId });
    } catch (e) {
      next(e);
    }
  }
);

// NOTE: ROUTE FOR GETTING QUIZ QUESTIONS

quizRouter.get(
  '/questions',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // NOTE: Get Quiz ID
      const quiz = await getQuizByName(DEFAULT_QUIZ);
      if (quiz === undefined)
        return res.status(500).send('Database Failure: Failed to get Quiz.');
      const quizId = quiz!.id;

      // NOTE: Get Quiz Questions
      const quizQuestions = await getQuizQuestionsByQuizId(quizId);
      if (quizQuestions === undefined)
        return res
          .status(500)
          .send('Database Failure: Failed to get Quiz Questions.');

      // NOTE: Send Quiz Questions
      res.status(200).send(quizQuestions);
    } catch (e) {
      next(e);
    }
  }
);

// NOTE: ROUTE FOR CREATING/CHECKING QUESTION RESPONSES

quizRouter.post(
  '/:submissionId/:questionId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // NOTE: Get Submission ID from Params
      const submissionId = parseInt(req.params.submissionId);
      if (isNaN(submissionId))
        return res
          .status(400)
          .send('Question ID (in params) must be an integer.');

      // NOTE: Get Question ID from Params
      const questionId = parseInt(req.params.questionId);
      if (isNaN(questionId))
        return res
          .status(400)
          .send('Question ID (in params) must be an integer.');

      // NOTE: Get Answer from Body
      const answer = parseInt(req.body.answer);
      if (isNaN(answer))
        return res.status(400).send('Answer (in body) must be an integer.');

      // NOTE: Create Question Response
      const questionResponse = await createQuestionResponse(
        questionId,
        submissionId,
        answer
      );
      if (questionResponse === undefined)
        return res
          .status(500)
          .send('Database Failure: Failed to create Question Response.');

      // NOTE: Get Quiz ID
      const quiz = await getQuizByName(DEFAULT_QUIZ);
      if (quiz === undefined)
        return res.status(500).send('Database Failure: Failed to get Quiz.');
      const quizId = quiz!.id;

      // NOTE: Check Question Response
      const correct = await checkQuestionResponse(questionResponse!, quizId);

      // NOTE: Send Question Reponse Result
      res.status(200).send(correct);
    } catch (e) {
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
        return res.status(401).send(`User not found with provided JWT.`);

      // NOTE: Check Database for Completion First
      if (user.passedQuiz) return res.status(200).send(true);

      // NOTE: Check Quiz Completion
      const userId = user.id;
      const complete = await checkQuizCompletion(userId, DEFAULT_QUIZ);

      // NOTE: Set User Completion in DB
      await setUserQuizCompletion(userId, complete);

      // NOTE: Send Quiz Completion Status
      res.status(200).send(complete);
    } catch (e) {
      next(e);
    }
  }
);
