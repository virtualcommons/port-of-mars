import { NextFunction, Request, Response, Router } from 'express';
import {
  checkQuizCompletion,
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
    const token: string = (req as any).token;
    let user = await getUserByJWT(token);
    let quiz = await getQuizByName(DEFAULT_QUIZ);

    if (user && quiz) {
      const userId = user.id;
      const quizId = quiz.id;
      const TEST = await checkQuizCompletion(userId);
      if (TEST) {
        // TODO: handle quiz completion in response
        res.json({ userComplete: TEST });
      } else {
        const submission = await createQuizSubmission(userId, quizId);
        // TODO: return submission id
        res.json({ userComplete: TEST });
      }
    } else {
      res.status(403).json(`User account with username ${req} not found.`);
    }
  } catch (e) {
    next(e);
  }
});

quizRouter.get('/', auth, async (req, res, next) => {
  try {
    let quiz = await getQuizByName(DEFAULT_QUIZ);
    if (quiz) {
      const { id } = quiz;
      const questions = await getQuizQuestionsbyQuizId(id);
      res.json(questions);
    } else {
      // TODO: Use correct status
      res.status(403).json(`Quiz not located in the database.`);
    }
  } catch (e) {
    next(e);
  }
});

// quiz/:submissionId/:quizId
// TODO: save submission id in localstorage/jwt

quizRouter.post('/:questionId', auth, async (req, res, next) => {
  try {
    const token: string = (req as any).token;
    let user = await getUserByJWT(token);

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
      res.status(403).json(`User account with username ${req} not found.`);
    }
  } catch (e) {
    next(e);
  }
});
