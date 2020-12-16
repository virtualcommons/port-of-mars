<template>
  <b-container class="vh-100 p-0 m-0" fluid>
    <!-- splash page text -->
      <b-row class="h-100 p-5 text-center">
        <b-col></b-col>
        <b-col align-self="end" class="m-5 p-5" cols="8">
          <h2 class="my-5 p-5">
            Port of Mars is a fun, game-based social science experiment set on the first human
            community on the Red Planet.
          </h2>
          <h2 class="my-5">Sign up to be notified about the next opportunity to play in the Mars Madness
            tournament.</h2>
          <b-button v-if="isLoggedIn" class="justify-content-center my-2" size="lg" variant="warning" @click="logout">
            {{ logoutText }}
          </b-button>
          <b-button v-else-if="!toggleDevLogin" :href="asuLoginUrl" class="justify-content-center my-2" size="lg" variant="success">
            Sign Up via ASU CAS
          </b-button>
          <b-form v-if="isDevMode && toggleDevLogin" class="justify-content-center my-2" inline @submit="devLogin">
            <label class="sr-only" for="input-username">Username</label>
            <b-form-input id="input-username" v-model="username" class="mx-3" placeholder="DEV_LOGIN" required>
            </b-form-input>
            <b-button type="submit" variant="success">
              <b-icon-gear></b-icon-gear>
            </b-button>
          </b-form>
          <b-form-checkbox v-if="isDevMode" switch size="sm" v-model="toggleDevLogin" class="pt-3">Developer Login</b-form-checkbox>
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
  color: $light-shade;
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
