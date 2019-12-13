<template>
    <div class="quiz-container">
        <div class="quiz-title">
            <h1>QUIZ</h1>
        </div>

        <div class="quiz-form">
            <QuizForm v-bind="quizQuestions[index]" :index='index' :handleUpdate="handleUpdate"/>
        </div>
    </div>
</template>

<script lang="ts">
import { QuizData } from 'shared/types';

import { Component, Vue } from 'vue-property-decorator';
import {BContainer, BRow, BCol} from 'bootstrap-vue';
import QuizForm from "@/components/tutorialquiz/QuizForm.vue";
@Component({
    components:{
        BContainer,
        BRow,
        BCol,
        QuizForm,
    }
})

export default class TutorialQuiz extends Vue {
    private answersArray = [-1,-1,-1,-1,-1,-1];
    private index = 0;

    private quizQuestions: Array<QuizData> = [
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

      correct: 0,
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
       
      correct: 0,
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

    handleUpdate(id,name){
        if(id == this.quizQuestions[this.index].correct){
            this.answersArray[this.index] = 1;
        } else {
            this.answersArray[this.index] = 0;
        }

        if(name != 2){
            this.index += name;
        } else {
            console.log(this.answersArray);
        }


        if(this.index < 0){
            this.index = 8;
        }

        if(this.index > 8){
            this.index = 0;
        }


    }
}
</script>

<style>
.quiz-page {
    /* position: relative;
    height: 100vh;
    width: 100%;
    display: flex;
    align-items: center; */
    color:white;
    height:6rem;
}

.quiz-screen {
    /* position: relative;
    z-index: 1;
    height: 80vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center; */
}

h1 {
    text-transform: uppercase;
    letter-spacing: 0.25rem;
    font-size: 11rem;
    font-weight: 700;
    color: var(--space-orange);
}

.quiz-container{
    position: relative;
    z-index: 1;
    color:white;
    width:100%;
    height:100%;
    text-align: center;
}

.quiz-title{
    color:white;
    width:100%;
    margin-left: auto;
    margin-right: auto;
}

.quiz-form{
    width: 40%;
    margin: auto;
    text-align: left;

}
</style>