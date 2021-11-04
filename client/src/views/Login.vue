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
    <b-row class="mx-2">
      <b-col align-self="center" cols="7" class="p-1">
        <b-embed type="iframe" aspect="21by9" :src="trailerVideoUrl" allowfullscreen>
        </b-embed>
      </b-col>
      <b-col align-self="start" cols="5" class="text-left mt-2">
        <h3 class="subtitle">
          <span v-if="isSignUpEnabled">
            The next Mars Madness tournament is coming soon! Register and get notified when it starts.
          </span>
          <span v-else>
            <b-badge variant="info">Round {{ tournamentRoundNumber }}</b-badge>
            of the Mars Madness tournament has begun!
          </span>
        </h3>
        <b-form-checkbox v-model="toggleDevLogin" v-if="isDevMode" class="my-2">
          <p v-if="toggleDevLogin" class="text-uppercase">Test Mode Enabled</p>
          <p v-else class="text-uppercase">Enable Test Mode</p>
        </b-form-checkbox>
        <b-button v-if="isAuthenticated" size="lg" variant="warning" @click="logout">
          {{ logoutText }}
        </b-button>
        <b-button
          v-else-if="!toggleDevLogin"
          :href="asuLoginUrl"
          size="lg"
          variant="primary"
          block
        >
          <b-icon class="mb-1" icon="box-arrow-right"></b-icon>
          <span v-if="isSignUpEnabled">
            Register for
          </span>
          <span v-else>
            Participate in
          </span>
          Mars Madness {{ currentYear }}
        </b-button>
        <!-- register form -->
        <b-form
          inline
          v-if="isDevMode && toggleDevLogin"
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
            <b-icon class="mb-1" icon="box-arrow-right"></b-icon> Sign in
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
import Footer from "@port-of-mars/client/components/global/Footer.vue";
import { DASHBOARD_PAGE } from "@port-of-mars/shared/routes";
import { isDevOrStaging } from "@port-of-mars/shared/settings";

@Component({
  components: {
    Footer
  }
})
export default class Login extends Vue {
  isSignUpEnabled: boolean = false;
  error: string = "";
  isDevMode: boolean = false;
  toggleDevLogin: boolean = false;
  currentYear = new Date().getFullYear();
  trailerVideoUrl = "https://player.vimeo.com/video/618174821?h=82fd072f73";
  tournamentRoundNumber = 1;
  

  logo = {
    center: true,
    fluid: true,
    blankColor: "#bbb",
    width: 225,
    height: 225
  };

  get asuLoginUrl() {
    return url("/asulogin");
  }

  get logoutText() {
    return `Sign Out (${this.user.username})`;
  }

  get isAuthenticated() {
    return this.user?.username;
  }

  get user() {
    return this.$tstore.state.user;
  }

  async created() {
    // FIXME: this should probably come from the server when we fetchData
    this.isDevMode = isDevOrStaging();
    await this.fetchData();
  }

  async fetchData() {
    try {
      await this.$ajax.get(url('/status/'), ({data, status}) => {
        this.isSignUpEnabled = data.isSignUpEnabled;
        this.tournamentRoundNumber = data.tournamentRoundNumber;
        if (data.user) {
          this.$tstore.commit('SET_USER', data.user);
          this.$router.push({ name: DASHBOARD_PAGE });
        }
      });
    }
    catch (e) {
      this.error = "Unable to connect to servers. Please try again later.";
      throw e;
    }
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
    this.isAuthenticated = false;
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
