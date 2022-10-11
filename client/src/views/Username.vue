<template>
  <b-container fluid class="h-100 w-100 d-flex justify-content-center align-items-center">
    <div id="login-container">
      <b-form @submit="signUp">
        <h1 class="text-center">Almost there!</h1>
        <hr>
        <b-form-group
          id="email-label"
          label="Email Address"
          label-for="email-input"
        >
          <b-form-input
            id="email-input"
            v-model="email"
            type="email"
            tabindex="-1"
            readonly
          >
          </b-form-input>
        </b-form-group>
        <b-form-group
          id="username-label"
          label="Pick a username"
          label-for="username-input"
        >
          <b-form-input
            id="username-input"
            v-model="username"
            type="text"
            ref="username"
            required
          >
          </b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary" block size="lg">Start Playing</b-button>
      </b-form>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { url } from "@port-of-mars/client/util";
import { isDevOrStaging } from "@port-of-mars/shared/settings";
import { ONBOARDING_PAGE } from "@port-of-mars/shared/routes"

@Component({})
export default class OpenLogin extends Vue {
  isDevMode: boolean = false;
  error: string = "";
  // TODO: add validation + errors for username
  username: string = "";
  // FIXME: use store
  email: string = "";

  onboarding = { name: ONBOARDING_PAGE };

  async created() {
    this.isDevMode = isDevOrStaging();
    if (this.isDevMode) this.email = "developer@portofmars.asu.edu";
  }

  mounted() {
    this.$refs.username.$el.focus();
  }

  async signUp(e: Event) {
    if (this.isDevMode) {
      this.devLogin(e);
      return;
    }
    // TODO: send ajax request and route to onboarding
    this.$router.push(this.onboarding);
  }

  async devLogin(e: Event) {
    e.preventDefault();
    const devLoginData: any = {
      username: this.username,
      password: "testing"
    };
    try {
      await this.$ajax.devLogin(devLoginData);
    } catch (e) {
      if (e instanceof Error) {
        this.error = e.message;
      }
    }
  }
}
</script>

<style lang="scss" scoped>

input:read-only {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: var(--dark-shade);
}

hr {
  margin: 2rem 0 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

#login-container {
  padding: 2rem;
  border-radius: 1rem;
  margin-top: -10rem;
  width: 30rem;
  background-color: rgba(0, 0, 0, 0.25);
}

</style>