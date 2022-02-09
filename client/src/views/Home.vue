<template>
  <b-container fluid>
    <Header></Header>
    <b-row
      v-if="isDevMode"
      class="w-100 m-0 p-0"
      align-v="start"
      align-h="start"
    >
      <b-alert class="text-center w-100 p-0" show variant="warning">
        <p class="mt-2">
          <b-icon
            class="mx-2"
            icon="exclamation-triangle-fill"
            variant="danger"
          ></b-icon>
          You are currently accessing a development version of the Port of Mars
          only used for testing. Go to
          <a href="https://portofmars.asu.edu">portofmars.asu.edu</a> for the
          real deal.
        </p>
      </b-alert>
    </b-row>
    <b-row class="w-100 mx-2" align-v="start">
      <b-col cols="12">
        <h1 class="title">
          Welcome to Port of Mars
          <b-badge class="float-right" variant="primary"
            >Round {{ tournamentRoundNumber }}</b-badge
          >
        </h1>
        <h3 class="subtitle">
          Port of Mars is a fun, game-based social science experiment set on the
          first human community on the Red Planet.
        </h3>
        <h4>{{ description }}</h4>
      </b-col>
    </b-row>
    <b-row class="mt-2">
      <b-col align-self="start" cols="7" class="p-3">
        <b-embed
          type="iframe"
          aspect="21by9"
          :src="trailerVideoUrl"
          allowfullscreen
        >
        </b-embed>
      </b-col>
      <b-col align-self="center" cols="5">
        <template v-if="isSignUpEnabled">
          <h3 class="subtitle">
            The next Mars Madness tournament is coming soon! Register and get
            notified when it starts.
          </h3>
        </template>
        <template v-else>
          <h3 class="subtitle">
          {{ announcement }}
          </h3>
          <b-button :to="loginPage" size="lg" variant="primary" class="w-75">
            <b-icon icon="box-arrow-right"></b-icon>
            <span v-if="isSignUpEnabled"> Register for </span>
            <span v-else> Participate in </span>
              Mars Madness {{ currentYear }}
          </b-button>
        </template>
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
import Footer from "@port-of-mars/client/components/global/Footer.vue";
import { LOGIN_PAGE, DASHBOARD_PAGE } from "@port-of-mars/shared/routes";
import { isDevOrStaging } from "@port-of-mars/shared/settings";
import Header from "@port-of-mars/client/components/global/Header.vue";

@Component({
  components: {
    Header,
    Footer,
  },
})
export default class Home extends Vue {
  testUsername: string = "";
  isSignUpEnabled: boolean = false;
  error: string = "";
  isDevMode: boolean = false;
  toggleDevLogin: boolean = false;
  currentYear = new Date().getFullYear();
  trailerVideoUrl = "https://player.vimeo.com/video/644046830";
  loginPage = { name: LOGIN_PAGE };
  dashboardPage = { name: DASHBOARD_PAGE };

  logo = {
    center: true,
    fluid: true,
    blankColor: "#bbb",
    width: 225,
    height: 225,
  };

  get tournamentStatus() {
    return this.$tstore.state.tournamentStatus;
  }

  get tournamentRoundNumber() {
    return this.tournamentStatus.round;
  }

  get announcement() {
    return (
      this.tournamentStatus.announcement ??
      `Register and complete Port of Mars Mission Control onboarding to be ready for the next Mars Madness tournament.`
    );
  }

  get description() {
    return (
      this.tournamentStatus.description ??
      `Participate in the next Mars Madness Tournament for a chance to win $1000 USD!`
    );
  }

  async mounted() {
    // FIXME: this should probably come from the server when we fetchData
    this.isDevMode = isDevOrStaging();
  }

/*
  async fetchData() {
    try {
      await this.$ajax.get(url("/status/"), ({ data, status }) => {
        console.log(data);
        this.isSignUpEnabled = data.isSignUpEnabled;
        Vue.set(this, "tournamentStatus", data.tournamentStatus);
        if (data.user) {
          console.log("setting user to ", data.user);
          this.$tstore.commit("SET_USER", data.user);
          this.$router.push(this.dashboardPage);
        }
      });
    } catch (e) {
      this.error = "Unable to connect to servers. Please try again later.";
      throw e;
    }
  }
  */
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
