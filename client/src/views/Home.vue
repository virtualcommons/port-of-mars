<template>
  <b-container fluid class="h-100 m-0 p-0">
    <b-row no-gutters class="h-100 w-100">
      <!-- about -->
      <section id="about" class="m-0 w-100">
        <b-row class="w-100 mx-2" align-v="center" align-h="center">
          <b-col sm="12" class="text-center">
            <h2>Welcome to Port of Mars</h2>
            <p class="my-3">
              Port of Mars is an online, game-based, social science experiment set on the first
              human community on the Red Planet. Currently recruiting Arizona State University
              Undergraduates for game play.
            </p>
          </b-col>
        </b-row>
      </section>

      <!-- schedule -->
      <!-- <section id="schedule">
        <b-row v-if="schedule.length > 0">
          <b-col class="m-4">
            <Schedule :schedule="schedule" :roundNumber="tournamentRoundNumber"> </Schedule>
          </b-col>
        </b-row>
      </section> -->

      <!-- prize info -->
      <section id="prize" class="w-100 p-5 text-center">
        <b-row class="w-100 mx-2" align-v="center" align-h="center">
          <b-col sm="12">
            <h3>{{ description }}</h3>
            <p class="text">
              The next Mars Madness tournament is coming soon! Sign up and get notified when it
              starts.
            </p>
            <template v-if="signupEnabled" class="my-5">
              <b-button squared variant="primary" :to="login"
                ><h4 class="p-1">Sign Up to Play</h4></b-button
              >
            </template>
            <template v-else>
              <h3 class="subtitle p-3 mr-4">
                {{ announcement }}
              </h3>
              <b-button :to="login" size="lg" variant="primary" class="w-75">
                <b-icon class="mb-2" icon="box-arrow-right"></b-icon>
                <template v-if="signupEnabled"> Register for </template>
                <template v-else> Participate in </template>
                Mars Madness {{ currentYear }}
              </b-button>
            </template>
          </b-col>
          <b-col v-if="schedule.length > 0" sm="12" class="m-5 text-center">
            <Schedule :schedule="schedule" :roundNumber="tournamentRoundNumber"> </Schedule>
          </b-col>
        </b-row>
      </section>

      <!-- game-trailer -->
      <section id="game-trailer" class="m-0 p-5 w-100">
        <b-row class="mt-2" align-v="center" align-h="center">
          <b-col align-self="center" sm="12" md="5">
            <h2>The Game</h2>
            <p class="text my-3">
              You are 1 of 5 residents at the Port of Mars, the first long-term habitat on the
              planet. Each game consists of 8 — 12 rounds, each with phases of investing, trading,
              purchasing, discarding, and reacting to Mars events. Chance and player actions impact
              system health. If system health falls to zero all players die.
            </p>

            <b-alert :show="tournamentRoundNumber > 1" variant="warning">
              Eligible participants have been invited via email to
              <b-badge variant="info">Round {{ currentRoundNumber }}</b-badge
              >.
            </b-alert>
          </b-col>
          <b-col align-self="start" sm="12" md="7" class="p-3">
            <b-embed
              class="p-1"
              type="iframe"
              aspect="21by9"
              :src="trailerVideoUrl"
              allowfullscreen
            ></b-embed>
          </b-col>
        </b-row>
      </section>
      <Footer></Footer>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Footer from "@port-of-mars/client/components/global/Footer.vue";
import Schedule from "@port-of-mars/client/components/dashboard/Schedule.vue";
import { LOGIN_PAGE, DASHBOARD_PAGE } from "@port-of-mars/shared/routes";
import { isDevOrStaging } from "@port-of-mars/shared/settings";

@Component({
  components: {
    Footer,
    Schedule
  }
})
export default class Home extends Vue {
  isDevMode: boolean = false;
  currentYear = new Date().getFullYear();
  trailerVideoUrl = "https://player.vimeo.com/video/644046830";
  login = { name: LOGIN_PAGE };
  dashboardPage = { name: DASHBOARD_PAGE };
  readonly SITE_URL = "https://portofmars.asu.edu";

  logo = {
    center: true,
    fluid: true,
    blankColor: "#bbb",
    width: 225,
    height: 225
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

  get currentRoundNumber() {
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
      return `from ${this.toDate(schedule[0])} to ${this.toDate(schedule[schedule.length - 1])}`;
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
h2,
h3 {
  color: var(--white);
  font-weight: bold;
  font-size: 2em;
}

h2 {
  text-transform: uppercase;
  text-align: center;
}

p {
  color: var(--white);
}

#about {
  background-image: url("../assets/images/bg-moon.png");
  padding: 150px 0 50px 0;
}

#about p {
  color: var(--white);
  width: 70%;
  margin: 0 auto;
}

#prize {
  width: 70%;
  margin: 0 auto;
  padding: 1rem;
  background: url("../assets/images/bg-stars.png") no-repeat;
  background-position: center;
  background-color: var(--black);
}

#game-trailer {
  background: url("../assets/images/bg-dark-moon.png");
}
</style>
