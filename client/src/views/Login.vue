<template>
  <b-container class="vh-100 p-0 m-0" fluid>
    <!-- splash page text -->
      <b-row class="h-100 p-5 text-center">
        <b-col></b-col>
        <b-col class="m-5 p-0" cols="8">
          <h2 class="title">Welcome to Port of Mars!</h2>
          <h2 class="m-5 text-left">
            Port of Mars is a fun, game-based social science experiment set on the first human
            community on the Red Planet.
          </h2>
          <p class="lead text-left">
            Click below to sign up to play in the Mars Madness tournament. After you register, you will receive an email in early March 2021 with details
            on how to participate in the tournament.
          </p>
          <b-alert show variant="primary">
            <h4><b-icon icon="exclamation-circle-fill" variant="primary"></b-icon> 
            Currently, the Mars Madness tournament is only open to undergraduate students at Arizona State University.</h4>
          </b-alert>
          <b-button v-if="isLoggedIn" size="lg" variant="warning" @click="logout">
            {{ logoutText }}
          </b-button>
          <b-button v-else-if="!toggleDevLogin" :href="asuLoginUrl" size="lg" variant="success">
            Sign Up via ASU CAS
          </b-button>
          <b-form v-if="isDevMode && toggleDevLogin" class="justify-content-center my-2" inline @submit="devLogin">
            <label for="input-username">Enter any username for testing</label>
            <b-form-input id="input-username" v-model="username" class="w-25 mx-3" placeholder="Test username" required>
            </b-form-input>
            <b-button type="submit" variant="success">
              <b-icon icon="box-arrow-right" class="mb-1"></b-icon> Test User Sign In
            </b-button>
          </b-form>
          <b-form-checkbox v-if="isDevMode" v-model="toggleDevLogin" class="pt-3">Enable Test User Sign In</b-form-checkbox>
          <b-alert v-if="error" variant="warning">{{ error }}</b-alert>
        </b-col>
        <b-col></b-col>
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
  font-size: 6rem;
  font-weight: 500;
  color: white;
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
