<template>
  <div class="tutorial-quiz">
    <div class="wrapper">
      <div class="title">
        <h1>QUIZ</h1>
      </div>

      <div v-show="submittedQuiz == false" class="quiz-container">
        <QuizForm
          v-for="(question, i) in quizQuestions"
          v-show="index === i"
          v-bind="quizQuestions[index]"
          :key="`${question.id} - attempt ${attempts}`"
          :index="index"
          :handleUpdate="handleUpdate"
          :answersComplete="answersComplete"
        />
      </div>

      <div v-show="submittedQuiz == false" class="button-container">
        <div
          v-for="n in quizQuestions.length"
          :key="n"
          :style="frameStyle(n - 1)"
          class="frame"
        >
          <button
            @click="handleQuestionSwitch(n - 1)"
            :style="buttonStyle(n - 1)"
          >
            {{ n }}
          </button>
        </div>
      </div>

      <div v-if="submittedQuiz == true" class="submission">
        <h2>You got {{ quizData }} questions correct.</h2>
        <p>Would you like to take the quiz again?</p>
        <button @click="handleReset">Restart Quiz</button>
        <button @click="sendResults" type="button" name="button">
          Continue
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, InjectReactive, Inject } from 'vue-property-decorator';
import QuizForm from '@/components/tutorial/QuizForm.vue';
import { QuizRequestAPI } from '@/api/quiz/request';
import { applyQuizServerResponses } from '@/api/quiz/response';
import store from '@/store';
import { Client } from 'colyseus.js';
import { QuizData, QuizQuestionData, QuizResultPackage } from 'shared/types';
@Component({
  components: {
    QuizForm
  }
})
export default class TutorialQuiz extends Vue {
  private index: number = 0;
  private answersArray: Array<number> = [];
  private answersComplete: boolean = false;
  private submittedQuiz: boolean = false;
  private attempts: number = 0;

  private api: QuizRequestAPI = new QuizRequestAPI();

  @Inject() readonly $client!: Client;

  async created() {
    const quizRoom = await this.$client.joinOrCreate('quiz');
    applyQuizServerResponses(quizRoom, store);
    this.api.connect(quizRoom);
  }

  get quizQuestions(): Array<QuizQuestionData> {
    const questions = this.$store.state.quizQuestions;

    // TODO: There's definitely a better place to do this...
    const length = Object.keys(questions).length;
    this.answersArray = new Array(length).fill(-1);

    return questions;
  }

  get quizResults(): Array<QuizResultPackage> {
    return this.$store.state.quizResults;
  }

  // TODO: Send results to server

  async sendResults(): Promise<void> {
    // TODO: Send quiz answers for grading
    const answers = JSON.stringify(this.answersArray);
    // TODO: Evaluate quiz answers on server
    // TODO: Send quiz results to client
    // TODO: Evaluate passing
    // TODO: Save to local storage

    const user: string = this.$store.state.user.username;
    const data: any = { user: user, answers: answers };

    const quizUrl: string = `${process.env.SERVER_URL_HTTP}/quiz`;
    const response = await fetch(quizUrl, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });

    if (response.status === 200) {
      const resData = await response.json();
      // TODO: Save passed data to local storage?
    } else {
      const error = await response.json();
      console.log('SUBMIT QUIZ ERROR: ', error);
    }
  }

  private handleQuestionSwitch(newIndex: number): void {
    this.index = newIndex;
  }

  get quizData(): number {
    let info: number = 0;

    this.quizResults.forEach(question => {
      if (question.correct) info++;
    });

    return info;
  }

  private isComplete(): void {
    if (!this.answersArray.includes(-1)) {
      this.answersComplete = true;
    }
  }

  private handleUpdate(optionSelected: number, navAction: number): void {
    console.log(this.answersArray);
    if (navAction === 2) {
      this.api.submitQuiz(this.answersArray);
      this.submittedQuiz = true;
    } else {
      if (navAction === 1) {
        this.answersArray.splice(this.index, 1, optionSelected);
        this.isComplete();
      }
      if (this.index === 0 && navAction === -1) {
        this.index = this.index;
      } else if (this.index + navAction !== this.quizQuestions.length) {
        this.index = (this.index + navAction) % this.quizQuestions.length;
      } else {
        this.index = 0;
      }
    }
  }

  private handleReset(): void {
    this.answersComplete = false;
    this.submittedQuiz = false;
    this.answersArray.fill(-1);
    this.attempts++;
    this.index = 0;
  }

  private buttonStyle(index: number): object {
    if (index === this.index) {
      return { backgroundColor: 'var(--space-orange)' };
    }
    return {};
  }

  private frameStyle(index: number): object {
    if (this.answersArray[index] !== -1) {
      return { border: '0.0625rem solid var(--space-orange)' };
    }
    return { border: '0.0625rem solid var(--space-orange-opaque-2)' };
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/views/TutorialQuiz.scss';
</style>
