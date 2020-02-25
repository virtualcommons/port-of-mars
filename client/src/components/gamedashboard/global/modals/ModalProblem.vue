<template>
  <div class="modal-problem">
    <p class="title">Submit an Issue</p>
    <p class="instructions">
      Send an issue to our team and we'll take a look at it as soon as we can.
    </p>
    <div v-if="!submitted" class="submission">
      <textarea v-model="issueText"></textarea>
      <button @click="handleSubmit">Submit</button>
    </div>
    <div v-else class="confirmation">
      <p>{{ submissionMessage }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class ModalProblem extends Vue {
  @Prop({}) private modalData!: object;
  private issueText: string = '';
  private submitted: boolean = false;
  private submitSuccessful: boolean | null = null;

  private async handleSubmit(): Promise<void> {
    if (this.issueText && this.issueText !== '') {
      this.submitted = true;

      const issueText = this.issueText;
      const issueUrl = `${process.env.SERVER_URL_HTTP}/issue/new`;
      const response = await this.$ajax.post(issueUrl, {
        issueText: issueText
      });

      if (response.status === 201) {
        this.submitSuccessful = true;
      } else {
        this.submitSuccessful = false;
      }
    }
  }

  get submissionMessage() {
    if (this.submitSuccessful === null) {
      return 'Sending issue report...';
    } else if (this.submitSuccessful) {
      return 'Your issue report has been received. Thank you!';
    } else {
      return 'There was an issue submitting your issue report.';
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/global/modals/ModalProblem.scss';
</style>
