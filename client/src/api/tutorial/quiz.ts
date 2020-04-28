import { Component, Vue } from 'vue-property-decorator';
import { QuizQuestionData } from '@port-of-mars/shared/types';
import * as _ from 'lodash';

@Component
export class QuizHandler extends Vue {
    private submissionId: any = null;
    private dataFetched: boolean = false;
    private quizQuestions: Array<QuizQuestionData> = [];
    private currentTutorialElementId: string = '';

    // TODO: Need to reset
    private currentOptionIndex: number = -1;
    private questionStatusMessage: string = '';
    private questionStatus: boolean = false;

    get quizSubmissionEndpoint() {
        return `${process.env.SERVER_URL_HTTP}/quiz/submission`;
    }
    
    get currentQuizQuestion() {
        const index = _.findIndex(this.quizQuestions, [
          'tutorialElementId',
          this.currentTutorialElementId
        ]);
        return this.quizQuestions[index];
    }
    
    get quizQuestionStatusMessage(){
        return this.questionStatusMessage;
    }

    get quizQuestionStatus(){
        return this.questionStatus;
    }

    public setCurrentTutorialElementId(currentTutorialElementId: string){
        this.currentTutorialElementId = currentTutorialElementId;
    }

    public resetQuizProperties(){
        this.currentOptionIndex = -1;
        this.questionStatusMessage = '';
        this.questionStatus = false;
    }
    
    async handleCheckQuizQuestion(value:number) {
        const result = await this.checkQuizQuestion(
          this.currentQuizQuestion.id,
          value
        );
        if(!this.questionStatus){
          if (result) {
            this.questionStatusMessage = 'Correct! Please click next.';
            this.questionStatus = true;
          } else {
            this.questionStatusMessage = 'Incorrect, please try again.';
          }
        } else{
          this.questionStatusMessage = 'You already answered correctly. Please click next.';
        }
    }
    
    private setSubmissionId(submissionId: number) {
        this.$ajax.setSubmissionId(submissionId);
        this.submissionId = submissionId;
    }
    
    
      // NOTE: Server Fetches
    public async initalizeQuiz() {
        let submissionId = this.$ajax.submissionId;
        let response;
        if (submissionId) {
          const retrieveSubmissionUrl = `${this.quizSubmissionEndpoint}/${submissionId}`;
          response = await this.$ajax.get(retrieveSubmissionUrl);
          console.log(`retrieving submission with id ${submissionId}`);
        }
        else {
          const createQuizSubmissionUrl = this.quizSubmissionEndpoint;
          response = await this.$ajax.post(createQuizSubmissionUrl);
          console.log('creating new submission');
        }
        const jsonData = await response.json();
        console.log(jsonData);
        this.setSubmissionId(jsonData.submissionId);
        this.quizQuestions = jsonData.quizQuestions;
        this.dataFetched = true;
    }
    
    private async checkQuizQuestion(questionId: number, answer: number): Promise<boolean> {
        const submitResponseUrl = `${this.quizSubmissionEndpoint}/${this.submissionId}/${questionId}`;
        const response = await this.$ajax.post(submitResponseUrl, { answer: answer });
        return await response.json();
    }
    
    public async completeQuiz(): Promise<void> {

        let status:any;
        const quizCompletionUrl = `${process.env.SERVER_URL_HTTP}/quiz/complete`;
        const response = await this.$ajax.get(quizCompletionUrl);
        if (response.status === 200) {
          const data = await response.json();
          status = data;
        } else {
          const error = await response.json();
          this.notifyUserOfError('checkQuizCompletion (response)', error);
          status = false
        }

        this.$ajax.setQuizCompletion(status);
        console.log('USER HAS COMPLETED QUIZ:', status);
    }
    
    private notifyUserOfError(call: string, error: any): void {
        // TODO: Show server error modal
        console.log(`ERROR FETCHING DATA AT ${call}!`);
        console.log('RESPONSE FROM SERVER: ', error);
    }
}