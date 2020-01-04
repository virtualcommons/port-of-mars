<template>
  <div class="quiz-question-container">
    <div class="quiz-question-title">
      <p>{{ question }}</p>
    </div>
    <div class="quiz-question-form-container">
      <form class="quiz-question-form" v-on:submit.prevent="handleUpdate(optionSelected, name)">
        <div class="quiz-questions" v-for="(option, index) in options" :key="index">
          <input type="radio" v-model="optionSelected" name="optionSelected" :value="index" />{{
            option
          }}<br />
        </div>
        <div class="quiz-buttons">
          <button @click="name = -1" class="prev-button">Previous</button>
          <button @click="name = 1" class="next-button">Save Answer</button>
          <button v-show="complete == true" @click="name = 2" class="next-button">
            Submit Quiz
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class QuizForm extends Vue {
  optionSelected = -1;
  name = 0;

  @Prop({ default: '' }) question;

  @Prop({ default: () => [] }) options;

  @Prop({ default: -1 }) index;

  @Prop({
    default: function(id, name) {
      return function() {};
    }
  })
  handleUpdate;

  @Prop({ default: false }) complete;
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/tutorial/QuizForm.scss';
</style>
