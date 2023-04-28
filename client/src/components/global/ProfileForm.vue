<template>
  <b-form @submit="updateProfile">
    <h4>Edit Profile</h4>
    <hr class="my-2" />
    <div v-if="!isVerified && !submitted" class="text-muted mb-3">
      Please fill out the fields below with your desired username and email so we can verify your
      email. Your full name is required if you wish to be eligible to win a gift card, but we will
      never publish or share this information. You may also resend the verification email if you
      have not received it yet. Sometimes email can take a few minutes to arrive in your inbox and
      you may need to check your spam folder as well.
    </div>
    <Messages class="mb-3"></Messages>
    <b-form-group
      description="Choose a public username to be displayed to other Port of Mars participants."
      label="Username"
      label-for="username"
    >
      <b-form-input
        id="username"
        v-model="form.username"
        placeholder="Username"
        required
        size="lg"
        type="text"
        :state="form.username.length <= 30 && form.username.length > 0"
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
        v-model="form.name"
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
        v-model="form.email"
        placeholder="Please enter a valid email address."
        required
        size="lg"
        type="email"
      >
      </b-form-input>
    </b-form-group>
    <b-form-group
      description="Please confirm your email."
      label="Confirm Email"
      label-for="confirmEmail"
    >
      <b-form-input
        id="confirmEmail"
        v-model="confirmEmail"
        placeholder="Please enter your email address again."
        required
        size="lg"
        type="email"
        :state="form.email === confirmEmail ? true : emailVerificationState"
      >
      </b-form-input>
    </b-form-group>
    <b-button type="submit" variant="success" :disabled="isVerificationDisabled">{{
      isVerified ? "Save" : "Save and Verify Email"
    }}</b-button>
  </b-form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Messages from "@port-of-mars/client/components/global/Messages.vue";
import { ProfileData } from "@port-of-mars/shared/types";
import { AccountAPI } from "@port-of-mars/client/api/account/request";

@Component({
  components: { Messages },
})
export default class ProfileForm extends Vue {
  api!: AccountAPI;

  form: ProfileData = {
    username: "",
    name: "",
    email: "",
  };
  confirmEmail = "";
  // track whether to show validation error on confirm email field
  // null: none, false: invalid, true: valid https://bootstrap-vue.org/docs/components/form-input#contextual-states
  emailVerificationState: boolean | null = null;
  submitted = false;
  // used to temporarily disable sending a verification email
  // to prevent overloading mailgun and spamming
  isVerificationDisabled = false;

  get hasConsented() {
    return this.$store.getters.hasConsented;
  }

  get isVerified() {
    return this.$store.getters.isVerified;
  }

  async created() {
    this.api = new AccountAPI(this.$store, this.$ajax);
    const data = await this.api.authenticate();
    if (data) {
      const { username, email, name, isVerified } = data;
      this.form.username = username;
      this.form.email = email;
      this.form.name = name;
      if (isVerified) {
        this.confirmEmail = email;
      }
    }
  }

  async updateProfile(e: Event) {
    e.preventDefault();
    if (!this.form.email || !(this.form.email === this.confirmEmail)) {
      this.emailVerificationState = false;
      console.log("no match");
      return;
    }
    await this.api.updateProfile(this.form);
    if (!this.isVerified) {
      this.isVerificationDisabled = true;
      setTimeout(() => (this.isVerificationDisabled = false), 20000);
    }
    this.submitted = true;
  }
}
</script>
