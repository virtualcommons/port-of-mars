<template>
  <div>
    <Messages class="position-fixed p-3"></Messages>
    <b-form class="pr-3" @submit="updateProfile">
      <b-alert v-if="isVerified" dismissible show variant="warning">
        It looks like you are all set to participate! Please review your profile information below.
      </b-alert>
      <b-alert v-else dismissible show variant="success"
        >Please fill out the fields below with your desired username and email so we can verify your
        email. Your full name is required if you wish to be eligible to win a gift card, but we will
        never publish or share this information. You may also resend the verification email if you
        have not received it yet. Sometimes email can take a few minutes to arrive in your inbox and
        you may need to check your spam folder as well.
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
          :state="username.length <= 30 && username.length > 0 ? true : false"
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
        <b-icon-exclamation-triangle-fill variant="danger"></b-icon-exclamation-triangle-fill>
        Please check your email and click on the link to verify your email.
      </b-alert>
      <b-button v-else type="submit" :disabled="isVerificationDisabled" variant="warning"
        >Resend verification email</b-button
      >
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Messages from "@port-of-mars/client/components/global/Messages.vue";
import { url } from "@port-of-mars/client/util";
import { LOBBY_PAGE } from "@port-of-mars/shared/routes";

@Component({
  components: { Messages },
})
export default class ProfileForm extends Vue {
  username = "";
  name = "";
  email = "";
  verifyEmail = "";
  dateConsented: Date | null = null;
  isVerified = false;
  // used to temporarily disable sending a verification email
  // to prevent overloading mailgun and spamming
  isVerificationDisabled = false;

  async created() {
    await this.$ajax.get(url("/account/authenticated"), response => {
      if (response.data) {
        const data = response.data;
        this.username = data.username;
        this.name = data.name;
        this.email = data.email;
        this.verifyEmail = data.email;
        this.isVerified = data.isVerified;
        if (data.dateConsented !== null) {
          this.dateConsented = new Date(Date.parse(data.dateConsented));
        }
      }
    });
  }

  get updateProfileUrl() {
    return url("/account/update-profile");
  }

  async updateProfile(e: Event) {
    e.preventDefault();
    if (!this.email || !this.emailsMatch) {
      // display error message to the user
      return;
    }
    const formData = { username: this.username, email: this.email, name: this.name };
    await this.$ajax.post(
      this.updateProfileUrl,
      ({ status }) => {
        if (status === 200) {
          this.$tstore.state.user.username = this.username;
          // temporarily disable verification
          this.isVerificationDisabled = true;
          // if user is already verified (mostly for dev mode), redirect to lobby
          if (this.isVerified) {
            this.$router.push({ name: LOBBY_PAGE });
          } else {
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

  get emailsMatch(): boolean {
    return this.email === this.verifyEmail;
  }

  get submitDisabled() {
    return this.username.length === 0 || this.email.length === 0 || !this.emailsMatch;
  }
}
</script>
