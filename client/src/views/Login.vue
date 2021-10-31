<template>
  <b-container fluid class="h-100 m-0 p-0">
    <b-row v-if="isDevMode" class="w-100 m-0 p-0" align-v="start" align-h="start">
      <b-alert class="text-center w-100 p-0" show variant="warning">
        <p class="mt-2">
          <b-icon class="mx-2" icon="exclamation-triangle-fill" variant="danger"></b-icon> You are
          currently accessing a development version of the Port of Mars only used for testing. Go to
          <a href="https://portofmars.asu.edu">portofmars.asu.edu</a> for the real deal.
        </p>
      </b-alert>
    </b-row>
    <b-row class="w-100 mx-2" align-v="start">
      <b-col cols="9" class="mr-auto">
        <h1 class="title">Welcome to the Port of Mars</h1>
        <h3 class="subtitle">
          Port of Mars is a fun, game-based social science experiment set on the first human
          community on the Red Planet.
        </h3>
      </b-col>
      <b-col>
        <b-img
          class="p-3"
          v-bind="logo"
          right
          :src="require(`@port-of-mars/client/assets/background/logo.png`)"
        >
        </b-img>
      </b-col>
    </b-row>
    <b-row class="mx-2" align-v="center">
      <b-col cols="7" class="mt-n4">
        <b-embed type="iframe" class="w-75" aspect="16by9"
          :src="trailerVideoUrl" allowfullscreen>
        </b-embed>
      </b-col>
      <b-col cols="4" class="text-left">
        <h3 class="subtitle">
          The next Mars Madness tournament is coming soon! Register and get notified when it starts.
        </h3>
        <b-form-checkbox v-model="toggleDevLogin" v-if="isDevMode" class="my-2">
          <p v-if="toggleDevLogin" class="text-uppercase">Test Mode Enabled</p>
          <p v-else class="text-uppercase">Enable Test Mode</p>
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
          Register for Mars Madness {{ currentYear }}
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
    </b-row>
    <!-- align Footer to bottom of viewport using Bootstrap fixed-bottom utility 
        https://getbootstrap.com/docs/4.4/utilities/position/#fixed-bottom
    -->
    <Footer class="fixed-bottom"></Footer>
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
  trailerVideoUrl = "https://player.vimeo.com/video/618174821?h=82fd072f73";

  logo = {
    center: true,
    fluid: true,
    blankColor: "#bbb",
    width: 225,
    height: 225
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
