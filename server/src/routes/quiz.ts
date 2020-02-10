import { NextFunction, Request, Response, Router } from 'express';
import {
  checkQuestionResponse,
  getQuizByName,
  createQuizSubmission,
  getQuizQuestionsbyQuizId,
  getRecentQuizSubmission,
  createQuestionResponse
} from '@/services/quiz';
import { getUserByJWT, getUserByUsername } from '@/services/account';
import { auth } from '@/routes/middleware';

export const quizRouter = Router();

const DEFAULT_QUIZ = 'TutorialQuiz';

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
    }
  } catch (e) {
    next(e);
  }
});

quizRouter.get('/', async (req, res, next) => {
  try {
    let quiz = await getQuizByName(DEFAULT_QUIZ);
    if (quiz) {
      const { id } = quiz;
      const questions = await getQuizQuestionsbyQuizId(id);
      res.json(questions);
    } else {
      res.status(403).json(`Quiz not located in the database.`);
    }
  } catch (e) {
    next(e);
  }
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
