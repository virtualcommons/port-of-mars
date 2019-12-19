import * as _ from 'lodash';
import { QuizData, QuizQuestionData } from 'shared/types';

const quizQuestionsRaw: Array<QuizData> = [
    {
      id: 1,
      question: "When does the game end?",
       
      correct: 2,
      options: [
        "When upkeep reaches 0",
       "After an unknown number of rounds",
       "After an unknown number of rounds, or earlier if Upkeep reaches 0",
       "When one of the players reaches 20 points",
      ]
    },
    {
      id: 2,
      question: "Can you chat with other participants?",
      correct: 1,
      options:[
        "No, communication is not possible in this game.",
        "Yes, in the chat box during the whole duration of the game.",
        "Yes, in the chat box during designated periods.",
        "Yes, if Upkeep is bigger than 35.",
      ]
    },
    {
      id: 3,
      question: "How do you trade cards with others?",

      correct: 2,
      options:[
        "During the trade period you indicate your preferences of cards",
        "Expressing your preferences in the chat box is sufficient.",
        "Discuss via chat and then express your deals during trade period",
        "When you allocate your time-blocks.",
      ]
    },
    {
      id: 4,
      question: "If Upkeep drops below 65 and is above 35 what happens?",
       
      correct: 1,
      options:["Chat is not possible anymore.",
      "Two events will happen that round.",
      "You get an additional four time-blocks.",
      "You get an extra accomplishment card.",]
    },
    {
      id: 5,
      question: "The following card is a special accomplishment card [image screwcard]. What does this card do?",
       
      correct: 3,
      options:["It costs x influence cards, y influence cards , and ..",
      "You earn x points",
      "You can only buy this card if you have the required influence cards",
      "All above three answers are correct",]
    },
    {
      id: 6,
      question: "The following card is a special accomplishment card [image screwcard]. What does this card do?",
       
      correct: 3,
      options:["It cost the player nothing individually",
      "The Upkeep level of the group will be reduced with x points",
      "The individual player will earn x points",
      "All above three answers are correct",]
    },
    {
      id: 7,
      question: "You get each round 10 time blocks? Which of the following statements is incorrect:",
       
      correct: 1,
      options:["You can spend as many time blocks as you want.",
      "Every time block not spend can be saved for next round.",
      "Each player has their special skills impacting the costs of influence cards.",
      "By default each time-block in Upkeep increases the Upkeep of the group with one unit.",]
    },
    {
      id: 8,
      question: "If Upkeep drops below 35 which of the following statements is true?",
       
      correct: 1,
      options:["The game ends",
      "The group will experience three events this round.",
      "The player with the least amount of points is eliminated.",
      "Nothing, life as usual on Mars.",]
    },
    {
      id: 9,
      question: "At the start of each round, 25 units is subtracted from Upkeep. What does this represent?",
       
      correct: 1,
      options:["The lack of contributions of others.",
      "A standard wear and tear.",
      "Solar flares",
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
    id:q.id,
    correct:q.correct
  }
})