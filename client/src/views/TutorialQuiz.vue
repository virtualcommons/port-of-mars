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

import { Component, Vue, Inject } from 'vue-property-decorator';
import {BContainer, BRow, BCol} from 'bootstrap-vue';
import QuizForm from "@/components/tutorialquiz/QuizForm.vue";
import { QuizRequestAPI } from '../api/quizAPI/request';
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
    
    get quizQuestions(){
      console.log(this.$store.state.quizQuestions);
      return this.$store.state.quizQuestions;
    }

    @Inject()
    readonly $api!: QuizRequestAPI;

    

    handleUpdate(id,name){
        // if(id == this.quizQuestions[this.index].correct){
        //     this.answersArray[this.index] = 1;
        // } else {
        //     this.answersArray[this.index] = 0;
        // }

        // if(name != 2){
        //     this.index += name;
        // } else {
        //     console.log(this.answersArray);
        // }


        // if(this.index < 0){
        //     this.index = 8;
        // }

        // if(this.index > 8){
        //     this.index = 0;
        // }
        this.answersArray[this.index] = id;

        if(name != 2){
          this.index = (this.index+name)%this.quizQuestions.length;
          if(this.index <= -1) this.index = this.quizQuestions.length-1;

        } else {
          this.$api.submitQuiz(this.answersArray);
        }

        console.log(this.index);
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