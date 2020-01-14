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
          <button v-show="complete === true" @click="name = 2" class="next-button">
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

  @Prop({ default: '' }) question!: string;

  @Prop({ default: () => [] }) options!: Array<string>;

  @Prop({ default: -1 }) index!: number;

  @Prop({
    default: function(id: number, name: string) {
      return function() {};
    }
  })
  handleUpdate!: Function;

  @Prop({ default: false }) complete!: boolean;
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/tutorial/QuizForm.scss';
</style>
