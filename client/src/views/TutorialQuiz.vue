<template>
  <div class="quiz-container">
    <div class="quiz-title">
      <h1>QUIZ</h1>
    </div>

    <div v-show="submitted == false" class="quiz-form">
      <QuizForm
        v-for="(question, i) in quizQuestions"
        :key="question.id"
        v-show="index == i"
        v-bind="quizQuestions[index]"
        :index="index"
        :handleUpdate="handleUpdate"
        :complete="complete"
      />
      <div class="questions-container">
        <button
          class="question-nav"
          v-for="n in quizQuestions.length"
          :key="n.id"
          @click="handleQuestionSwitch(n - 1)"
        >
          <!-- <p class="question-num">{{n}}</p> -->
          {{ n }}
        </button>
      </div>
    </div>

    <div v-show="submitted == true">
      <h2>You got {{ quizData.correct }} questions correct!</h2>
      <p>Would you like to take the quiz again?</p>
      <br />
      <button @click="handleReset()">Restart Quiz</button>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue, InjectReactive, Inject} from 'vue-property-decorator';
import QuizForm from '@/components/tutorial/QuizForm.vue';
import { QuizRequestAPI } from '@/api/quiz/request';
import {applyQuizServerResponses} from "@/api/quiz/response";
import store from "@/store";
import {Client} from 'colyseus.js';
import {QuizData, QuizQuestionData, QuizResultPackage} from "shared/types";
@Component({
  components: {
    QuizForm
  }
})
export default class TutorialQuiz extends Vue {
  private answersArray: Array<number> = [];
  private index = 0;
  private complete = false;
  private submitted = false;

  @Inject() readonly $client!: Client;

  api: QuizRequestAPI = new QuizRequestAPI();

  async created() {
    const quizRoom = await this.$client.joinOrCreate('quiz');
    applyQuizServerResponses(quizRoom, store);
    this.api.connect(quizRoom);
  }

  get quizQuestions(): Array<QuizQuestionData> {
    return this.$store.state.quizQuestions;
  }

  get quizResults(): Array<QuizResultPackage> {
    return this.$store.state.quizResults;
  }

  get quizData() {
    let info = { correct: 0 };

    this.quizResults.forEach(question => {
      if (question.correct) info.correct++;
    });

    return info;
  }

  handleUpdate(id: number, name: number) {
    if (name === 1) this.answersArray.splice(this.index, 1, id);

    this.complete = this.answersArray.length == this.quizQuestions.length;

    if (name !== 2) {
      if (this.index + name != this.quizQuestions.length)
        this.index = (this.index + name) % this.quizQuestions.length;
      if (this.index <= -1) this.index = this.quizQuestions.length - 1;
    } else {
      this.api.submitQuiz(this.answersArray);
      this.submitted = true;
    }
  }

  handleReset() {
    this.submitted = false;
    this.index = 0;
    this.complete = false;
    this.answersArray = [];
  }

  handleQuestionSwitch(newIndex: number) {
    this.index = newIndex;
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/views/TutorialQuiz.scss';
</style>
