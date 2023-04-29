<template>
  <b-container class="h-auto p-3 d-flex flex-column" fluid>
    <h1>Port of Mars Consent Form</h1>
    <div class="content-container p-3">
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
    <div>
      <p v-if="hasConsented" class="text-success mb-0 mt-3">
        <b-icon-patch-check-fill></b-icon-patch-check-fill>
        You have consented to the terms of this research project.
      </p>
      <b-button-group class="my-3 align-self-start">
        <b-button variant="success" @click="grantConsent" :disabled="isVerified && hasConsented">
          {{ grantConsentMsg }}
        </b-button>
        <b-button variant="danger" @click="denyConsent" class="mx-2"> Deny Consent </b-button>
      </b-button-group>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Constants } from "@port-of-mars/shared/settings";
import { AccountAPI } from "@port-of-mars/client/api/account/request";
import { PROFILE_PAGE } from "@port-of-mars/shared/routes";

@Component({})
export default class Consent extends Vue {
  api!: AccountAPI;

  get constants() {
    return Constants;
  }

  get hasConsented() {
    return this.$store.getters.hasConsented;
  }

  get isVerified() {
    return this.$store.getters.isVerified;
  }

  get grantConsentMsg(): string | boolean {
    if (this.hasConsented && !this.isVerified) {
      return "Continue to Verification";
    } else {
      return "Grant Consent";
    }
  }

  async created() {
    this.api = new AccountAPI(this.$store, this.$ajax);
  }

  async grantConsent() {
    await this.api.grantConsent();
    this.$router.push({ name: PROFILE_PAGE });
  }

  async denyConsent() {
    await this.api.denyConsent();
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
</style>
