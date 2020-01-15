<template>
  <div class="quiz-form">
    <div class="title">
      <p class="number">Question {{ index + 1 }}</p>
      <p class="question">{{ question }}</p>
    </div>

    <div class="wrapper">
      <form v-on:submit.prevent="">
        <div class="questions" v-for="(option, index) in options" :key="index">
          <button
            @click="handleSelected(index)"
            :style="handleSelectedStyle(index)"
            type="button"
          ></button>
          <p>{{ option }}</p>
        </div>
      </form>
    </div>

    <div class="button-container">
      <button
        @click="navigationHandler(-1)"
        class="prev-button"
        :disabled="index === 0"
      >
        Previous
      </button>
      <button
        @click="navigationHandler(1)"
        :disabled="optionSelected === -1"
        class="next-button"
      >
        Save Answer
      </button>
      <button
        :disabled="answersComplete === false"
        @click="navigationHandler(2)"
        class="submit-button"
      >
        Submit Quiz
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class QuizForm extends Vue {
  @Prop({ default: '' }) question!: string;
  @Prop({ default: () => [] }) options!: Array<string>;
  @Prop({ default: -1 }) index!: number;
  @Prop({
    default: function(id: number, navAction: string) {
      return function() {};
    }
  })
  handleUpdate!: Function;
  @Prop({ default: false }) answersComplete!: boolean;

  private optionSelected: number = -1;

  private navigationHandler(navAction: number) {
    this.handleUpdate(this.optionSelected, navAction);
  }

  private handleSelected(option: number): void {
    this.optionSelected = option;
  }

  private handleSelectedStyle(option: number): object {
    if (option === this.optionSelected) {
      return { backgroundColor: 'var(--space-orange)' };
    }
    return {};
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/tutorial/QuizForm.scss';
</style>
