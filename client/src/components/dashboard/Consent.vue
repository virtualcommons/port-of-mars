<template>
  <b-container class="p-3 h-100 d-flex flex-column" fluid>
    <h1>Port of Mars Consent Form and Email Registration</h1>
    <b-collapse class="consent-scrollable" id="consent-collapse" :visible="showConsentForm">
      <div class="consent-form-text">
        <p>Dear Participant,</p>
        <p>
        I am a professor in the <a href='https://schoolofsustainability.asu.edu/'>School of Sustainability</a> at
        <a href='https://asu.edu'>Arizona State University</a>.
        I am conducting experiments that investigate how people think, act, and make decisions. This research is part of
        the <a href="https://interplanetary.asu.edu/"> Interplanetary Initiative </a> at Arizona State University.
        </p>
        <p>
        I am requesting your participation in a game, <em>Port of Mars</em>. The game will take no more than 60 minutes
        on average. Your participation in this study is voluntary. <strong>You must be 18 or older to participate in the
        study.</strong> If you choose not to participate or to withdraw from the study at any time, there will be no
        penalty; it will not affect your compensation for participation up to that point.
        </p>
        <p>
          During the game you can chat with other participants. By signing this
          consent form, you consent to:
        </p>
        <ul class="h5">
          <li>Abstain from personal attacks or harassment</li>
          <li>
            Abstain from using profanity or offensive language when
            communicating with your fellow participants
          </li>
          <li>Only communicate with other participants via the chat options within the game</li>
        </ul>
        <p v-if="constants.GIFT_CARD_AMOUNT">
        If you win the game, and 4 other human players participated, your name will be added to a weekly drawing for a
        ${{ constants.GIFT_CARD_AMOUNT }} USD Amazon gift card.
        </p>
        <p>
          Society may benefit from this research because an understanding of how people make decisions can help us to
          design policies and that sustain the use of shared resources, in this experiment in a habitat on Mars. You may
          benefit from this experience by learning about how an experiment is designed and conducted, what issues are of
          interest to social scientists and space research, and how make decisions in unanticipated situations.
          <em>There are no foreseeable risks or discomforts to your participation</em>.
        </p>
        <p>
          The results of the research study may be published, but your name will not be used. De-identified data
          collected as part of the study may be shared with other researchers for research purposes only. Your responses
          will be confidential. However, due to the group nature of this study, complete confidentiality cannot be
          guaranteed. We delete all personal information such as your email address from our database after the study
          has been completed and ensure that only anonymized participant identifiers are associated with any published
          experiment data.
        </p>
        <p>
          If you have any questions concerning the research study, please
          contact
          <a href="mailto:Marco.Janssen@asu.edu">Marco.Janssen@asu.edu</a>.
        </p>
        <p align="justify">Sincerely,</p>
        <p align="justify">Dr. Marco Janssen</p>
        <p class="text-muted">
          <small>
          This research has been reviewed by the ASU Social Behavioral Institutional Review Board (IRB). If the research
          team has not responded to your questions or concerns or if you are unable to establish contact with the
          research team you may contact the IRB by phone at 1.480.965.6788 or via email at
          <a href='mailto:research.integrity@asu.edu'>research.integrity at asu dot edu</a>.
          </small>
        </p>
      </div>
    </b-collapse>
    <div v-if="isVerified" class="mt-4 align-self-start text-success">
      <p>
        <b-icon icon="patch-check-fill"></b-icon>
        <small> You have agreed to the consent form and successfully been verified!</small>
      </p>
    </div>
    <div v-else>
      <b-button-group class="my-3 align-self-start">
        <b-button variant="success" @click="toggleConsent">
          {{ consentLabel }}
        </b-button>
        <b-button variant="danger" @click="denyConsent" class="mx-2">
          Deny Consent
        </b-button>
      </b-button-group>
    </div>
    <b-collapse v-if="!isVerified" class="consent-scrollable" v-model="consented">
      <b-form class="pr-3" @submit="register">
        <b-alert v-if="existingUser" dismissible show variant="warning">
          It looks like you have logged in before! Please review the
          information below, and resend your verification email if you have not
          received it yet. Sometimes email can take a few minutes to arrive in
          your inbox and you may need to check your spam folder as well.
        </b-alert>
        <b-alert v-else dismissible show variant="success"
          >Please fill out the fields below with your desired username and email so we can
          verify your email. Your full name is required if you wish to be eligible to win
          a gift card, however, we will never publish nor share this information.
        </b-alert>
        <b-form-group
          description="Choose a public username to be displayed to other Port of Mars participants."
          label="Username"
          label-for="username"
        >
          <b-form-input
            id="username"
            v-model="username"
            placeholder="Username"
            required
            size="lg"
            type="text"
          >
          </b-form-input>
        </b-form-group>
        <b-form-group
          description="To be eligible to win a gift card, please enter your full name."
          label="Name (optional)"
          label-for="name"
        >
          <b-form-input
            id="name"
            v-model="name"
            placeholder="Enter your full name"
            size="lg"
            type="text"
          >
          </b-form-input>
        </b-form-group>
        <b-form-group
          description="We will only use your email to contact you for Port of Mars related activities and will never share your email."
          label="Email"
          label-for="email"
        >
          <b-form-input
            id="email"
            v-model="email"
            placeholder="Please enter a valid email address."
            required
            size="lg"
            type="email"
          >
          </b-form-input>
        </b-form-group>
        <b-form-group
          description="Please verify your email."
          label="Verify Email"
          label-for="verifyEmail"
        >
          <b-form-input
            id="verifyEmail"
            v-model="verifyEmail"
            placeholder="Please enter your email address again."
            required
            size="lg"
            type="email"
          >
          </b-form-input>
        </b-form-group>
        <b-alert v-if="!isVerified" variant="warning">
          <b-icon icon="exclamation-triangle-fill" variant="danger"></b-icon>
          Please check your email and click on the link to verify your email.
        </b-alert>
        <b-button
          v-if="!hasConsented"
          :disabled="submitDisabled"
          type="submit"
          variant="success"
          >Grant Consent to Participate
        </b-button>
        <b-button
          v-else
          type="submit"
          :disabled="isVerificationDisabled"
          variant="warning"
          >Resend verification email</b-button
        >
      </b-form>
    </b-collapse>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { url } from "@port-of-mars/client/util";
import { Constants } from "@port-of-mars/shared/settings";
import { DASHBOARD_PAGE } from "@port-of-mars/shared/routes";
import Messages from "@port-of-mars/client/components/dashboard/Messages.vue";
import _ from "lodash";

@Component({
  components: { Messages },
})
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

  get messages() {
    return this.$tstore.state.dashboardMessages;
  }

  get existingUser() {
    return this.dateConsented !== null;
  }

  get showConsentForm() {
    return !this.consented;
  }

  get consentLabel() {
    return this.consented ? "Read Consent Form" : "Grant Consent and Register";
  }

  get emailsMatch(): boolean {
    return this.email === this.verifyEmail;
  }

  get submitDisabled() {
    return (
      this.username.length === 0 || this.email.length === 0 || !this.emailsMatch
    );
  }

  get grantConsentUrl() {
    return url("/registration/grant-consent");
  }

  async created() {
    await this.$ajax.get(url("/registration/authenticated"), (response) => {
      if (response.data) {
        const data = response.data;
        this.username = data.username;
        this.name = data.name;
        this.email = data.email;
        this.verifyEmail = data.email;
        this.isVerified = data.isVerified;
        if (data.dateConsented !== null) {
          this.dateConsented = new Date(Date.parse(data.dateConsented));
          this.hasConsented = true;
        }
        this.consented = false;
      }
    });
  }

  async register(e: Event) {
    e.preventDefault();
    if (this.emailsMatch && !_.isEmpty(this.email)) {
      const formData = { username: this.username, email: this.email, name: this.name };
      await this.$ajax.post(
        this.grantConsentUrl,
        ({ data, status }) => {
          if (status === 200) {
            this.$tstore.state.user.username = this.username;
            // temporarily disable verification
            this.isVerificationDisabled = true;
            this.hasConsented = true;
            // if user is already verified (mostly for dev mode), redirect to dashboard
            if (this.isVerified) {
              this.$router.push({ name: DASHBOARD_PAGE });
            }
            else {
              this.$tstore.commit("SET_DASHBOARD_MESSAGE", {
                kind: "success",
                message: `We have sent an email to ${this.email}.
               Please wait for it to arrive then click on the link inside to verify your email.
               It may take some time to arrive, and you may need to check your spam folder as well.
               You can close this browser window as the link will take you back to Port of Mars again.`,
              });
            }
            // re-enable the re-send verification email button
            setTimeout(() => (this.isVerificationDisabled = false), 20000);
          }
        },
        formData
      );
    }
  }

  toggleConsent() {
    this.consented = !this.consented;
  }

  denyConsent(): void {
    this.$ajax.denyConsent();
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
mark {
  background-color: $light-accent;
}
p {
  font-size: 1.2rem;
}

.consent-form-text {
  padding: 0.5rem;
  background-color: $light-shade-05;
}

.consent-scrollable {
  overflow: auto;
}
</style>
