<template>
  <b-container class="bg" fluid>
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
          <a :href="SITE_URL">{{ SITE_URL }}</a> for the
          real deal.
        </p>
      </b-alert>
    </b-row>
    <b-row class="w-100 mx-2" align-v="start">
      <b-col cols="12">
        <h1 class="jumbo-title">
          Welcome to Port of Mars
        </h1>
        <h2>
          Port of Mars is a fun, game-based social science experiment set on the
          first human community on the Red Planet.
        </h2>
        <h3 class="subtitle">
            {{ description }}
        </h3>
      </b-col>
    </b-row>

    <b-row v-if="schedule.length > 0">
      <b-col>
        <Schedule :schedule="schedule" :roundNumber="tournamentRoundNumber">
        </Schedule>
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
        <template v-if="signupEnabled">
          <h3 class="subtitle">
            The next Mars Madness tournament is coming soon! Register and get
            notified when it starts.
          </h3>
        </template>
        <template v-else>
          <h3 class="subtitle p-3 mr-4">
            {{ announcement }}
          </h3>
          <b-button :to="loginPage" size="lg" variant="primary" class="w-75">
            <b-icon class="mb-2" icon="box-arrow-right"></b-icon>
            <template v-if="signupEnabled"> Register for </template>
            <template v-else> Participate in </template>
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
import Header from "@port-of-mars/client/components/global/Header.vue";
import Schedule from "@port-of-mars/client/components/dashboard/Schedule.vue";
import { LOGIN_PAGE, DASHBOARD_PAGE } from "@port-of-mars/shared/routes";
import { isDevOrStaging } from "@port-of-mars/shared/settings";

@Component({
  components: {
    Footer,
    Header,
    Schedule,
  },
})
export default class Home extends Vue {
  isDevMode: boolean = false;
  currentYear = new Date().getFullYear();
  trailerVideoUrl = "https://player.vimeo.com/video/644046830";
  loginPage = { name: LOGIN_PAGE };
  dashboardPage = { name: DASHBOARD_PAGE };
  readonly SITE_URL = "https://portofmars.asu.edu";

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

  get schedule() {
    return this.tournamentStatus.schedule;
  }

  get signupEnabled() {
    return this.$tstore.state.signupEnabled;
  }

  get tournamentRoundNumber() {
    return this.tournamentStatus.round;
  }

  get announcement() {
    return (
      this.tournamentStatus.announcement ||
      `Register and complete Port of Mars Mission Control onboarding to be ready for the next Mars Madness tournament.`
    );
  }

  get description() {
    return (
      this.tournamentStatus.description ||
      `Participate in the next Mars Madness Tournament ${this.dateRange} for a chance to win $1000 USD!`
    );
  }

  get dateRange() {
    const schedule = this.schedule;
    if (schedule.length > 0) {
      return `from ${this.toDate(schedule[0])} to ${this.toDate(
        schedule[schedule.length - 1]
      )}`;
    }
    return "";
  }

  async mounted() {
    // FIXME: this should probably come from the server when we fetchData
    this.isDevMode = isDevOrStaging();
    console.log("status: ", this.tournamentStatus);
  }

  toDate(timestamp: number) {
    return new Date(timestamp).toDateString();
  }
}
</script>

<style lang="scss" scoped>
.jumbo-title {
  font-size: 3.8rem;
  font-weight: 800;
  color: var(--dark-shade);
}

.subtitle {
  background-color: var(--dark-shade-75);
  font-size: 2rem;
  font-weight: 500;
  color: var(--white);
}
</style>
