import { NextFunction, Request, Response, Router } from 'express';
import {
  checkQuizQuestion,
  getQuizByName,
  createQuizSubmission,
  getQuizQuestionsbyQuizId
} from '@/services/quiz';
import {getUserByJWT, getUserByUsername} from '@/services/account';
import {auth} from "@/routes/middleware";

export const quizRouter = Router();

const DEFAULT_QUIZ = 'TutorialQuiz';

quizRouter.post('/', auth, async (req, res, next) => {
  try {
    const token: string = (req as any).token;
    let user = await getUserByJWT(token);
    let quiz = await getQuizByName(DEFAULT_QUIZ);

    if (user && quiz) {
      // NOTE: create quiz submission
      const userId = user.id;
      const quizId = quiz.id;

      // TODO: Check if quiz submission exists (within 30 minutes);
      const submission = await createQuizSubmission(userId, quizId);
      console.log(submission);
    } else {
      res
        .status(403)
        .json(`User account with username ${req} not found.`);
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

quizRouter.post('/:id/:optionSubmitted', (req, res, next) => {
  // console.log(req.headers);
  // let user = await getUserByJWT()

  const { id, optionSubmitted } = req.params;
  const idAsInt: number = parseInt(id);
  const optionSubmittedAsInt: number = parseInt(optionSubmitted);
  const correct = checkQuizQuestion(idAsInt, optionSubmittedAsInt);
  res.json(correct);
});
