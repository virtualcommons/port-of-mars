<template>
  <b-container class="h-auto p-3 d-flex flex-column" fluid>
    <h1>Port of Mars Consent Form</h1>
    <div class="consent-form-text">
      <p>Dear Participant,</p>
      <p>
        I am a professor in the
        <a href="https://schoolofsustainability.asu.edu/">School of Sustainability</a> at
        <a href="https://asu.edu">Arizona State University</a>. I am conducting experiments that
        investigate how people think, act, and make decisions. This research is part of the
        <a href="https://interplanetary.asu.edu/"> Interplanetary Initiative </a> at Arizona State
        University.
      </p>
      <p>
        I am requesting your participation in a game, <em>Port of Mars</em>. The game will take no
        more than 60 minutes on average. Your participation in this study is voluntary.
        <strong>You must be 18 or older to participate in the study.</strong> If you choose not to
        participate or to withdraw from the study at any time, there will be no penalty; it will not
        affect your compensation for participation up to that point.
      </p>
      <p>
        During the game you can chat with other participants. By signing this consent form, you
        consent to:
      </p>
      <ul class="h5">
        <li>Abstain from personal attacks or harassment</li>
        <li>
          Abstain from using profanity or offensive language when communicating with your fellow
          participants
        </li>
        <li>Only communicate with other participants via the chat options within the game</li>
      </ul>
      <p v-if="constants.GIFT_CARD_AMOUNT">
        If you win the game, and 4 other human players participated, your name will be added to a
        weekly drawing for a ${{ constants.GIFT_CARD_AMOUNT }} USD Amazon gift card.
      </p>
      <p>
        Society may benefit from this research because an understanding of how people make decisions
        can help us to design policies and that sustain the use of shared resources, in this
        experiment in a habitat on Mars. You may benefit from this experience by learning about how
        an experiment is designed and conducted, what issues are of interest to social scientists
        and space research, and how make decisions in unanticipated situations.
        <em>There are no foreseeable risks or discomforts to your participation</em>.
      </p>
      <p>
        The results of the research study may be published, but your name will not be used.
        De-identified data collected as part of the study may be shared with other researchers for
        research purposes only. Your responses will be confidential. However, due to the group
        nature of this study, complete confidentiality cannot be guaranteed. We delete all personal
        information such as your email address from our database after the study has been completed
        and ensure that only anonymized participant identifiers are associated with any published
        experiment data.
      </p>
      <p>
        If you have any questions concerning the research study, please contact
        <a href="mailto:Marco.Janssen@asu.edu">Marco.Janssen@asu.edu</a>.
      </p>
      <p align="justify">Sincerely,</p>
      <p align="justify">Dr. Marco Janssen</p>
      <p class="text-muted">
        <small>
          This research has been reviewed by the ASU Social Behavioral Institutional Review Board
          (IRB). If the research team has not responded to your questions or concerns or if you are
          unable to establish contact with the research team you may contact the IRB by phone at
          1.480.965.6788 or via email at
          <a href="mailto:research.integrity@asu.edu">research.integrity at asu dot edu</a>.
        </small>
      </p>
    </div>
    <div v-if="isVerified" class="mt-4 align-self-start text-success">
      <p>
        <b-icon-patch-check-fill></b-icon-patch-check-fill>
        You have agreed to the consent form and successfully been verified!
        <small>If you've changed your mind, you can deny consent below.</small>
        <b-button variant="danger" @click="denyConsent" class="mx-2"> Deny Consent </b-button>
      </p>
    </div>
    <div v-else>
      <b-button-group class="my-3 align-self-start">
        <b-button variant="success" @click="grantConsent"> Grant Consent </b-button>
        <b-button variant="danger" @click="denyConsent" class="mx-2"> Deny Consent </b-button>
      </b-button-group>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { url } from "@port-of-mars/client/util";
import { Constants } from "@port-of-mars/shared/settings";

@Component({})
export default class Consent extends Vue {
  username = "";
  name = "";
  email = "";
  consented = false;
  verifyEmail = "";
  dateConsented: Date | null = null;
  hasConsented = false;
  isVerified = false;
  isVerificationDisabled = false;

  get constants() {
    return Constants;
  }

  get existingUser() {
    return this.dateConsented !== null;
  }

  get emailsMatch(): boolean {
    return this.email === this.verifyEmail;
  }

  get submitDisabled() {
    return this.username.length === 0 || this.email.length === 0 || !this.emailsMatch;
  }

  async grantConsent() {
    await this.$ajax.grantConsent();
    // FIXME: push to update profile form
  }

  async denyConsent() {
    await this.$ajax.denyConsent();
    // FIXME: push to landing page
  }
}
</script>

<style lang="scss" scoped>
h2 {
  margin-bottom: 0;
  text-transform: uppercase;
  letter-spacing: 0.25rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: $light-shade;
}

a {
  color: $light-accent;
  font-weight: 600;
}

p {
  font-size: 1.2rem;
}

.consent-form-text {
  padding: 0.5rem;
  background-color: $light-shade-05;
}
</style>
