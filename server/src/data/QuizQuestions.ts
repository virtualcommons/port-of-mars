import * as _ from 'lodash';
import { QuizData, QuizQuestionData } from 'shared/types';

const quizQuestionsRaw: Array<QuizData> = [
    {
      id: 1,
      question: "When does the game end?",
      correct: 2,
      options: [
        "When System Health reaches 0.",
       "After an unknown number of rounds.",
       "After an unknown number of rounds, or earlier if System Health reaches 0.",
       "When one of the players reaches 20 points.",
      ]
    },
    {
      id: 2,
      question: "Can you chat with other participants?",
      correct: 1,
      options:[
        "No, communication is not allowed in this game.",
        "Yes, in the chat box throughout the entire game.",
        "Yes, in the chat box only during specially designated periods.",
        "Yes, as long as System Health is greater than 35.",
      ]
    },
    {
      id: 3,
      question: "How do you trade Influence Resources with others?",
      correct: 2,
      options:[
        "During the trading phase you say what Influence Resources you want and then you'll receive them.",
        "By communicating your trade preferences in the chat box.",
        "Discuss potential trades with the other members of your group in the chat and then issue Trade Requests during the trading phase to execute a Trade.",
        "By investing your timeblocks.",
      ]
    },
    {
      id: 4,
      question: "What happens if the System Health drops between 35 and 65?",
      correct: 1,
      options:["You can no longer chat with your group.",
      "Two events will occur in this round.",
      "You get an additional four timeblocks.",
      "You get an extra Accomplishment card.",]
    },
    {
      id: 5,
      question: "The following card is a special accomplishment card [image screwcard]. What does this card do?",
      correct: 3,
      options:["It costs x influence cards, y influence cards, and ..",
      "You earn x points",
      "You can only buy this card if you have the required influence cards",
      "All above three answers are correct",]
    },
    {
      id: 6,
      question: "The following is a special Accomplishment card [image screwcard]. What does this Acomplishment do?",
      correct: 3,
      options:["No Influence Resources are needed to purchase this Accomplishment.",
      "The group's System Health will be reduced by 6",
      "The player purchasing this Accomplishment will earn 3 points",
      "All above three answers are correct",]
    },
    {
      id: 7,
      question: "Each round you have 10 timeblocks to invest. Which of the following statements is incorrect?",
      correct: 1,
      options:["You can spend as many timeblocks as you want.",
      "Every timeblock you do not spend can be saved and used in the next round.",
      "Each player has unique skills that change the costs of specific Influence Resources.",
      "Each timeblock invested in System Health increases your group's System Health by 1.",]
    },
    {
      id: 8,
      question: "If your group's System Health drops below 35 which of the following statements is true?",
      correct: 1,
      options:["The game ends.",
      "The group will encounter three Events this round.",
      "The player with the least number of points is eliminated.",
      "Nothing, life as usual on Mars.",]
    },
    {
      id: 9,
      question: "At the start of each round, 25 units is subtracted from System Health. What does this represent?",
      correct: 1,
      options:["A lack of contributions from the other members of your group.",
      "Standard wear and tear.",
      "A solar flare striking your habitat.",
      "The costs of trade.",]
    }
  ]

export const QuizQuestions:Array<QuizQuestionData> = quizQuestionsRaw.map((q) => {
  return {
    id:q.id,
    question:q.question,
    options:q.options,
  }
});

export const QuizQuestionAnswers = quizQuestionsRaw.map((q) => {
  return {
    id: q.id,
    correct: q.correct
  };
});
