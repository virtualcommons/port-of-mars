<template>
  <div class="quiz-container">
    <div class="quiz-title">
      <h1>QUIZ</h1>
    </div>

    <div v-show="submitted == false" class="quiz-form">
      <QuizForm
        v-bind="quizQuestions[index]"
        :index="index"
        :handleUpdate="handleUpdate"
        :complete="complete"
      />
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
import { Component, Vue, Inject } from 'vue-property-decorator';
import QuizForm from '@/components/tutorial/QuizForm.vue';
import { QuizRequestAPI } from '@/api/quiz/request';
@Component({
  components: {
    QuizForm
  }
})
export default class TutorialQuiz extends Vue {
  private answersArray = [];
  private index = 0;
  private complete = false;
  private submitted = false;

  get quizQuestions() {
    return this.$store.state.quizQuestions;
  }

  get quizResults() {
    const results = this.$store.state.quizResults;
    return results;
  }

  get quizData() {
    let info = { correct: 0 };

    this.quizResults.forEach(question => {
      if (question.correct) info.correct++;
    });

    return info;
  }

  @Inject()
  readonly $api!: QuizRequestAPI;

  handleUpdate(id, name) {
    if (name == 1) this.answersArray.splice(this.index, 1, id);

    this.complete = this.answersArray.length == this.quizQuestions.length;

    if (name != 2) {
      if (this.index + name != this.quizQuestions.length)
        this.index = (this.index + name) % this.quizQuestions.length;
      if (this.index <= -1) this.index = this.quizQuestions.length - 1;
    } else {
      this.$api.submitQuiz(this.answersArray);
      this.submitted = true;
    }
  }

  handleReset() {
    this.submitted = false;
    this.index = 0;
    this.complete = false;
    this.answersArray = [];
  }
}
</script>

<style lang="scss">
@import '@/stylesheets/views/TutorialQuiz.scss';
</style>
