import {NextFunction, Request, Response, Router} from "express";
import {getQuizQuestions} from "@/services/quiz";

export const quizRouter = Router();

quizRouter.get('/',(req, res, next) => {
  const questions = getQuizQuestions();
  res.json(questions);
});

quizRouter.post('/:id', (req, res, next) => {

});