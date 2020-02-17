import { NextFunction, Request, Response, Router } from 'express';
import {
<<<<<<< Updated upstream
  createQuizSubmission,
  createQuestionResponse,
  getQuizByName,
  getQuizQuestionsByQuizId,
  setUserQuizCompletion,
  checkQuestionResponse,
  checkQuizCompletion
} from '@/services/quiz';
import { getUserByJWT } from '@/services/account';
=======
  checkQuestionResponse,
  getQuizByName,
  createQuizSubmission,
  getQuizQuestionsbyQuizId,
  getRecentQuizSubmission,
  createQuestionResponse
} from '@/services/quiz';
import { getUserByJWT, getUserByUsername } from '@/services/account';
>>>>>>> Stashed changes
import { auth } from '@/routes/middleware';

export const quizRouter = Router();

const DEFAULT_QUIZ = 'TutorialQuiz';

<<<<<<< Updated upstream
// NOTE: ROUTE FOR CREATING A QUIZ SUBMISSION

quizRouter.post(
  '/create',
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // NOTE: Get User ID
      const token: string = (req as any).token;
      const user = await getUserByJWT(token);
      if (user === undefined)
        return res.status(401).send(`User not found with provided JWT.`);
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
  auth,
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
  auth,
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
=======
quizRouter.post('/', auth, async (req, res, next) => {
  try {
    const token: string = (req as any).body.token;
    let user = await getUserByJWT(token);
    let quiz = await getQuizByName(DEFAULT_QUIZ);

    if (user && quiz) {
      const userId = user.id;
      const quizId = quiz.id;
      const submission = await createQuizSubmission(userId, quizId);
    } else {
      res.status(403).json(`User not found.`);
>>>>>>> Stashed changes
    }
  }
);

// NOTE: ROUTE FOR CHECKING QUIZ COMPLETION

quizRouter.get(
  '/complete',
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // NOTE: Get User
      const token: string = (req as any).token;
      const user = await getUserByJWT(token);
      if (user === undefined)
        return res.status(401).send(`User not found with provided JWT.`);

      // NOTE: Check Database for Completion First
      if (user!.passedQuiz) return res.status(200).send(true);

      // NOTE: Check Quiz Completion
      const userId = user!.id;
      const complete = await checkQuizCompletion(userId, DEFAULT_QUIZ);

      // NOTE: Set User Completion in DB
      await setUserQuizCompletion(userId, complete);

      // NOTE: Send Quiz Completion Status
      res.status(200).send(complete);
    } catch (e) {
      next(e);
    }
  }
<<<<<<< Updated upstream
);
=======
});

quizRouter.post('/:questionId', async (req, res, next) => {
  try {
    const token: string = (req as any).body.token;
    const user = await getUserByJWT(token);

    if (user) {
      const questionId = parseInt(req.params.questionId);
      const userId = user.id;
      const submission = await getRecentQuizSubmission(userId);
      // console.log('SUBMISSION: ', submission);
      const submissionId = submission!.id;
      const answer = parseInt(req.body.answer);
      const questionResponse = await createQuestionResponse(
        questionId,
        submissionId,
        answer
      );
      // console.log('QUESTION RESPONSE: ', questionResponse);

      const quiz = await getQuizByName(DEFAULT_QUIZ);
      const quizId = quiz!.id;

      const correct = await checkQuestionResponse(questionResponse, quizId);
      res.json(correct);
    } else {
      res.status(403).json(`User not found.`);
    }
  } catch (e) {
    next(e);
  }
});
>>>>>>> Stashed changes
