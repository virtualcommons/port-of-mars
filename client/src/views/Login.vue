<template>
  <b-container class="h-100 p-0 m-0" fluid>
    <!-- splash page text -->
    <b-row class="h-100 p-0 text-center justify-content-center">
      <b-col class="my-4 p-0 align-content-center" cols="auto">
        <h2 class="title">Welcome to Port of Mars!</h2>
        <h2 class="m-5">
          Port of Mars is a fun, game-based social science experiment set on the first human
          community on the Red Planet.
        </h2>
        <b-container :style="'background-color: rgba(34, 26, 27, .9)'" class="mb-5 pb-5 w-75">
          <b-row :style="'background-color: rgb(156, 81, 71); color: $dark-shade;'"
                 class="mb-3 py-4 justify-content-center">
            <h2>Sign Up for Mars Madness 2021</h2>
          </b-row>
          <b-alert show variant="warning">
            <p>
              <b-icon class="mx-2" icon="exclamation-triangle-fill" size="lg" variant="warning"></b-icon>
              Currently, the Mars Madness tournament is only open to undergraduate students at Arizona State University.
            </p>
          </b-alert>
          <p class="mx-3">
            Click below to sign up to play in the Mars Madness tournament. After you register, you will receive an email
            in early March 2021 with details
            on how to participate in the tournament.
          </p>
          <b-form-checkbox v-model="toggleDevLogin" v-if="isDevMode" class="my-2">
            <p v-if="toggleDevLogin" class="text-uppercase">Test Mode Enabled</p>
            <p v-else class="text-uppercase">Test Mode Disabled</p>
          </b-form-checkbox>
          <b-button v-if="isLoggedIn" size="lg" variant="warning" @click="logout">
            {{ logoutText }}
          </b-button>
          <b-button v-else-if="!toggleDevLogin" :href="asuLoginUrl" class="my-2" size="lg" variant="success">
            Sign Up via ASU CAS
          </b-button>

          <!-- register form -->
          <b-form inline v-if="isDevMode && toggleDevLogin" class="justify-content-center" @submit="devLogin">
            <b-form-input
              id="input-username"
              v-model="username"
              placeholder="Enter any username for testing"
              required
            >
            </b-form-input>
            <b-button class="mx-2" icon type="submit" variant="success">
              <b-icon class="mb-1 mr-2" icon="box-arrow-right"></b-icon>Sign in
            </b-button>
          </b-form>
          <b-alert v-if="error" variant="warning">{{ error }}</b-alert>
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {url} from "@port-of-mars/client/util";
import {isDevOrStaging} from "@port-of-mars/shared/settings";
import Consent from '@port-of-mars/client/components/dashboard/Consent.vue'
import Sponsors from '@port-of-mars/client/components/dashboard/Sponsors.vue'

@Component({
  components: {
    Consent,
    Sponsors
  }
})
export default class Login extends Vue {
  username: string = "";
  isLoggedIn: boolean = false;
  error: string = "";
  isDevMode: boolean = false;
  toggleDevLogin: boolean = false;

  get submitDisabled() {
    return !this.username;
  }

  get asuLoginUrl() {
    return url("/asulogin");
  }

  get logoutText() {
    const username = this.$tstore.state.user.username;
    return username ? `Logout (${username})` : `Logout (Expired)`;
  }

  created() {
    this.isLoggedIn = !!this.$ajax.username;
    this.isDevMode = isDevOrStaging();
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
      this.error = e.message;
    }
  }

  logout() {
    this.$ajax.forgetLoginCreds();
    this.$ajax.forgetSubmissionId();
    this.isLoggedIn = false;
  }
}
</script>

<style lang="scss" scoped>
// HTML TEXT ELEMENTS
a {
  text-decoration: none;
}

h2 {
  margin-bottom: 0;
  text-transform: uppercase;
  letter-spacing: 0.25rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
}

.title {
  letter-spacing: 0.75rem;
  font-size: 5.5rem;
  font-weight: 750;
  color: $main-brand;
}

.subtitle {
  letter-spacing: 0.25rem;
  font-size: 2.75rem;
  font-weight: 600;
  color: white;
}

section {
  scroll-snap-align: start;
  height: 100vh;
  width: 100vw;
}

// LOGIN :: FORM

input[type="text"] {
  border: solid 0.1rem $light-shade;

  &:focus,
  &:active {
    outline: none;
  }

  &::placeholder {
    font-size: $font-med;
    font-weight: $medium !important;
    color: $light-shade-25;
  }
}
</style>
