<template>
  <b-container class="container registration">
    <b-row class="p-3">
      <b-col>
        <h1>Port of Mars Consent Form and Email Registration</h1>
      </b-col>
    </b-row>
    <b-row v-if="messages.length > 0" class="message-wrapper">
      <!-- FIXME: should create a component for this instead of repeating it across multiple pages -->
      <!-- MESSAGES -->
      <h2>Messages</h2>
      <b-alert :key="dm.message" :variant="dm.kind" dismissible fade show
                v-for="dm in messages">
        {{ dm.message }}
      </b-alert>
    </b-row>
    <b-row>
      <b-collapse :visible="showConsentForm" id="consent-collapse">
        <b-card>
          <b-card-text class="form-text">
            <p>Dear Participant,</p>
            <p>
                I am a professor in the School of Sustainability at Arizona State University.
                I am conducting experiments that investigate how people think, act, and make decisions.
                This research is part of the <a href='https://interplanetary.asu.edu/'>Interplanetary Initiative</a> at 
                Arizona State University.
            </p>
            <p>
                I am requesting your participation in a tournament consisting of several rounds of games. Each game in
                the tournament will take no more than 60 minutes on average. The top ranking players in each round will
                qualify for the next round and will receive an email invitation to participate in another game on a
                later day. Your participation in this study is strictly voluntary and you may choose to not participate
                or to withdraw from the study at any time with no penalty; it will not affect your compensation for
                participation up to that point.
            </p>
            <p>
                <mark>You must be 18 or older to participate in the study.</mark>
            </p>
            <p>During the game you can chat with other participants. By signing this consent form, you consent to:</p>
                <ul>
                    <li>Abstain from personal attacks or harassment</li>
                    <li>Abstain from using profanity or offensive language when communicating with your fellow participants</li>
                </ul>
            <p>
                For participation in this study you may receive extra credit if you are in a class with a participating instructor.
                Those who qualify for the championship round will be invited to have lunch with Arizona State University's astronaut in residence,
                Catherine Coleman. The <em>winner</em> of the Mars Madness tournament will be able to create new personalized content
                for the next edition of Mars Madness.
            </p>
            <p>
                Society may benefit from this research because an understanding of how people make decisions can
                help us to design regulations that sustain the use of shared resources, in this experiment in a
                colony on Mars.  You may benefit from this experience because you learn something about how an
                experiment is designed and conducted, what issues are of interest to social scientists and space
                research, and how your own cognitive abilities come into play in decision making situations.
                There are no foreseeable risks or discomforts to your participation.
            </p>
            <p>
                The results of the research study may be published, but your name will not be used. Your responses will
                be confidential. However, due to the group nature of this study, complete confidentiality cannot be
                guaranteed. If you are participating in this study as part of a class for extra credit, we may inform
                your instructor that you have participated, for example. We also have to keep track of which players
                will move on to next rounds. We will remove personal information such as your email address from our
                database after the tournament has been completed and ensure that only anonymized participant identifiers
                are associated with your experiment data.
            </p>
            <p>
                If you have any questions concerning the research study, please contact
                <a href="mailto:Marco.Janssen@asu.edu">Marco.Janssen@asu.edu</a>.
            </p>

            <p align="justify">Sincerely,</p>
            <p align="justify">Dr. Marco Janssen</p>
          </b-card-text>
        </b-card>
      </b-collapse>
      <b-button-group class="mt-2">
        <b-button @click="toggleConsent" variant="success">{{ consentLabel }}</b-button>
        <b-button @click="logout" variant="danger" class="ml-2">Deny Consent</b-button>
      </b-button-group>
    </b-row>
    <b-row>
      <b-col class="p-0 m-0">
        <b-collapse v-model="consented">
          <b-form @submit="register">
            <b-form-group label='Name' label-for='name' description='Please enter your full name.'>
              <b-form-input
              id='name'
              v-model='name'
              type='text'
              size='lg'
              required
              placeholder='Enter your full name'>
              </b-form-input>
            </b-form-group>
            <b-form-group label='Email' label-for='email' description='We will only use your email to contact you for Port of Mars related activities and will never share your email.'>
              <b-form-input
              id='email'
              v-model='email'
              type='email'
              size='lg'
              placeholder='Please enter a valid email address.'
              required>
              </b-form-input>
            </b-form-group>
            <b-form-group label='Verify Email' label-for='verifyEmail' description='Please verify your email.'>
              <b-form-input
              id='verifyEmail'
              v-model='verifyEmail'
              type='email'
              size='lg'
              placeholder='Email address (again)'
              required>
              </b-form-input>
            </b-form-group>
            <b-alert variant="danger" dismissible v-if="error">
              <b-icon icon="exclamation-triangle-fill" variant="danger"></b-icon> {{ error }}
            </b-alert>
            <b-button type="submit" variant="primary" :disabled="submitDisabled">Grant Consent to Participate</b-button>
          </b-form>
        </b-collapse>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { url } from "@port-of-mars/client/util";
import {LOGIN_PAGE, TUTORIAL_PAGE} from "@port-of-mars/shared/routes";
import _ from 'lodash';

@Component({})
export default class Register extends Vue {
  username = "";
  name = "";
  email = "";
  verifyEmail = "";
  consented = false;
  error = "";

  get messages() {
    return this.$tstore.state.dashboardMessages;
  }

  async created() {
    await this.$ajax.get(url('/registration/authenticated'), () => {})
  }

  async register(e: Event) {
    e.preventDefault();
    if (this.emailsMatch && !_.isEmpty(this.email)) {
      const formData = { name: this.name, email: this.email };
      await this.$ajax.post(this.grantConsentUrl, ({data, status}) => {
        if (status === 200) {
          this.$tstore.commit("SET_DASHBOARD_MESSAGE", {
            kind: "success",
            message: `We have sent an email to ${this.email}, please check your email to verify your email continue.`
          });
        }
        else {
          console.error("Unexpected status code: " + status);
          console.error(data);
        }
      }, formData);

    }
  }

  get showConsentForm() {
    return ! this.consented;
  }

  get consentLabel() {
    return this.consented ? "Read Consent Form" : "Grant Consent";
  }

  toggleConsent() {
    this.consented = ! this.consented;
  }

  gotoTutorial() {
    this.$router.push({ name: TUTORIAL_PAGE });
  }

  get emailsMatch(): boolean {
    return this.email === this.verifyEmail;
  }

  get submitDisabled() {
    return this.name.length === 0 || this.email.length === 0 || ! this.emailsMatch;
  }

  get grantConsentUrl() {
    return url('/registration/grant-consent');
  }

  logout(): void {
    this.$ajax.forgetLoginCreds();
    this.$router.push({name: LOGIN_PAGE});
  }
}
</script>

<style lang="scss">
  @import '@port-of-mars/client/stylesheets/views/Consent.scss';
</style>
