<template>
  <b-container class="h-100 m-0 p-0" fluid>
    <b-row no-gutters align-v="stretch" align-h="center" class="w-100 h-100">
      <b-row no-gutters v-if="isDevMode" class="w-100" align-v="start" align-h="start">
        <b-alert class="text-center w-100 m-0 p-0" show variant="warning">
          <p class="mt-2">
            <b-icon class="mx-2" icon="exclamation-triangle-fill" variant="danger"></b-icon> You are
            currently accessing a development version of the Port of Mars only used for testing. Go
            to <a href="https://portofmars.asu.edu">portofmars.asu.edu</a> for the real deal.
          </p>
        </b-alert>
      </b-row>
      <b-row class="w-100" align-v="start">
        <b-col class="text-left" align-self="start">
          <h1 class="title">Welcome to Port of Mars</h1>
          <h3 class="subtitle">
            Port of Mars is a fun, game-based social science experiment set on the first human
            community on the Red Planet.
          </h3>
        </b-col>
      </b-row>
      <b-col cols="6" class="text-center">
        <iframe
          src="https://player.vimeo.com/video/618174821?h=82fd072f73"
          width="640"
          height="360"
          frameborder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen
        ></iframe
      ></b-col>
      <b-col cols="4" class="text-left" align-self="center">
        <h3 class="subtitle">
          The next Mars Madness tournament is coming soon! Register below and get notified when it starts.
        </h3>
      </b-col>
      <b-row class="w-100">
        <b-col cols="6" offset="3" class="text-center" align-self="end">
          <b-form-checkbox v-model="toggleDevLogin" v-if="isDevMode" class="my-2">
            <p v-if="toggleDevLogin" class="text-uppercase">Test Mode Enabled</p>
            <p v-else class="text-uppercase">Test Mode Disabled</p>
          </b-form-checkbox>
          <b-button v-if="isLoggedIn" size="lg" variant="warning" @click="logout">
            {{ logoutText }}
          </b-button>
          <b-button
            v-else-if="!toggleDevLogin"
            :href="asuLoginUrl"
            class="my-2"
            size="lg"
            variant="primary"
            squared
            block
          >
          <h3>Register for Mars Madness {{ currentYear }}</h3>
          </b-button>

          <!-- register form -->
          <b-form
            inline
            v-if="isDevMode && toggleDevLogin"
            class="justify-content-center"
            @submit="devLogin"
          >
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
        </b-col>
        <b-col cols="2" offset="1" align-self="end">
          <b-img
            fluid
            v-bind="mainProps"
            :src="require(`@port-of-mars/client/assets/background/logo.png`)"
          ></b-img>
        </b-col>
      </b-row>
      <b-row class="mt-5 w-100" align-v="end" align-h="end">
        <Footer></Footer>
      </b-row>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { url } from "@port-of-mars/client/util";
import { isDevOrStaging } from "@port-of-mars/shared/settings";
import Consent from "@port-of-mars/client/components/dashboard/Consent.vue";
import Footer from "@port-of-mars/client/components/global/Footer.vue";

@Component({
  components: {
    Consent,
    Footer
  }
})
export default class Login extends Vue {
  username: string = "";
  isLoggedIn: boolean = false;
  error: string = "";
  isDevMode: boolean = false;
  toggleDevLogin: boolean = false;
  currentYear = new Date().getFullYear();

  mainProps = {
    center: true,
    fluid: true,
    blankColor: "#bbb",
    width: 250,
    height: 250
  };

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
      if (e instanceof Error) {
        this.error = e.message;
      }
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

.title {
  letter-spacing: 0.25rem;
  font-size: 5rem;
  font-weight: 600;
  color: white;
}

.subtitle {
  font-size: 2rem;
  font-weight: 500;
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
