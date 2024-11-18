<template>
  <b-container fluid class="h-100 w-100 d-flex justify-content-center align-items-center backdrop">
    <div id="login-container" class="content-container">
      <b-form>
        <h1 class="text-center">Login or Sign Up</h1>
        <hr />
        <p>
          Port of Mars is now in Open Beta, where anyone aged 18 and over<AgeTooltip
            placement="top"
          />
          can participate as long as they agree to our
          <a target="_blank" href="https://researchintegrity.asu.edu/human-subjects"
            >Arizona State University IRB-approved</a
          >
          consent form and
          <b-button variant="link" class="p-0" v-b-toggle="'coc-collapse'">
            code of conduct </b-button
          >.
        </p>
        <b-collapse id="coc-collapse" class="p-2 backdrop">
          <ul>
            <li>Abstain from personal attacks or harassment</li>
            <li>
              Abstain from using profanity or offensive language when communicating with your fellow
              participants
            </li>
            <li>Only communicate with other participants via the chat options within the game</li>
          </ul>
        </b-collapse>
        <hr />
        <div v-if="isDevMode">
          <b-form-checkbox v-model="toggleDevLogin">
            <p v-if="toggleDevLogin">Test Mode Enabled</p>
            <p v-else>Enable Test Mode</p>
          </b-form-checkbox>
          <b-form inline v-if="isDevMode && toggleDevLogin" @submit="devLogin">
            <b-form-checkbox v-model="shouldSkipVerification">
              <p>Skip consent/verification</p>
            </b-form-checkbox>
            <b-form-input
              class="w-100 mb-2"
              id="input-username"
              v-model="devLoginUsername"
              placeholder="Sign up or sign back in with a username"
              description="Enter any unique-ish username"
              required
            >
            </b-form-input>
            <b-button class="w-100 mb-3" type="submit" variant="primary" size="lg">
              <b-icon-file-earmark-code class="float-left" />Sign in (Test Mode)
            </b-button>
          </b-form>
          <b-alert v-if="error" variant="warning">{{ error }}</b-alert>
        </div>
        <b-button block variant="white" size="lg" class="mb-3" :href="googleLoginUrl">
          <b-icon-google class="float-left" />Sign in with Google
        </b-button>
        <b-button block variant="facebook" size="lg" class="mb-3" :href="facebookLoginUrl">
          <b-icon-facebook class="float-left" />Sign in with Facebook
        </b-button>
      </b-form>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { url } from "@port-of-mars/client/util";
import { isDevOrStaging } from "@port-of-mars/shared/settings";
import { CONSENT_PAGE } from "@port-of-mars/shared/routes";
import AgeTooltip from "@port-of-mars/client/components/global/AgeTooltip.vue";
import { AuthAPI } from "@port-of-mars/client/api/auth/request";

@Component({
  components: {
    AgeTooltip,
  },
})
export default class Login extends Vue {
  authApi!: AuthAPI;

  isDevMode: boolean = false;
  toggleDevLogin: boolean = false;
  shouldSkipVerification: boolean = true;
  devLoginUsername: string = "";
  error: string = "";

  consent = { name: CONSENT_PAGE };

  async created() {
    this.authApi = new AuthAPI(this.$store, this.$ajax, this.$router);
    this.isDevMode = isDevOrStaging();
  }

  get googleLoginUrl() {
    return url("/auth/google");
  }

  get facebookLoginUrl() {
    return url("/auth/facebook");
  }

  async devLogin(e: Event) {
    e.preventDefault();
    const devLoginData: any = {
      username: this.devLoginUsername,
      password: "testing",
    };
    try {
      await this.authApi.devLogin(devLoginData, this.shouldSkipVerification);
    } catch (e) {
      if (e instanceof Error) {
        this.error = e.message;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#login-container {
  padding: 2rem;
  width: 30rem;
}

ul {
  list-style: circle !important;
  padding-left: 2rem;
}
</style>
