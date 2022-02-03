<template>
  <b-container fluid>
    <Header></Header>
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
        <h1 class="title">Welcome to Port of Mars</h1>
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
    <b-row class="mt-2">
      <b-col cols="7" class="mt-4 p-5">
        <b-embed type="iframe" aspect="21by9" :src="trailerVideoUrl" allowfullscreen> </b-embed>
      </b-col>
      <b-col align-self="center" cols="5">
        <h3 class="subtitle">
          <span v-if="isSignUpEnabled">
            The next Mars Madness tournament is coming soon! Register and get notified when it
            starts.
          </span>
          <span v-else>
            <b-badge variant="info">Round {{ tournamentRoundNumber }}</b-badge>
            of the Mars Madness tournament is now open!
          </span>
        </h3>
        <b-alert :show="tournamentRoundNumber > 1" variant="warning">
          Eligible participants have been invited via email to
          <b-badge variant="info">Round {{ tournamentRoundNumber }}</b-badge
          >.
        </b-alert>
      </b-col>
    </b-row>
    <Footer></Footer>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { url } from "@port-of-mars/client/util";
import Footer from "@port-of-mars/client/components/global/Footer.vue";
import { DASHBOARD_PAGE } from "@port-of-mars/shared/routes";
import { isDevOrStaging } from "@port-of-mars/shared/settings";
import Header from "@port-of-mars/client/components/global/Header.vue";

@Component({
  components: {
    Header,
    Footer
  }
})
export default class Login extends Vue {
  testUsername: string = "";
  isSignUpEnabled: boolean = false;
  error: string = "";
  isDevMode: boolean = false;
  toggleDevLogin: boolean = false;
  currentYear = new Date().getFullYear();
  trailerVideoUrl = "https://player.vimeo.com/video/644046830";
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
      await this.$ajax.get(url("/status/"), ({ data, status }) => {
        this.isSignUpEnabled = data.isSignUpEnabled;
        this.tournamentRoundNumber = data.tournamentRoundNumber;
        if (data.user) {
          this.$tstore.commit("SET_USER", data.user);
          this.$router.push({ name: DASHBOARD_PAGE });
        }
      });
    } catch (e) {
      this.error = "Unable to connect to servers. Please try again later.";
      throw e;
    }
  }

  async devLogin(e: Event) {
    e.preventDefault();
    const devLoginData: any = {
      username: this.testUsername,
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

  async logout() {
    await this.$ajax.forgetLoginCreds();
    this.$ajax.forgetSubmissionId();
  }
}
</script>

<style lang="scss" scoped>
.title {
  letter-spacing: 0.25rem;
  font-size: 4rem;
  font-weight: 600;
  color: white;
}

.subtitle {
  font-size: 2rem;
  font-weight: 500;
  color: white;
}
</style>
