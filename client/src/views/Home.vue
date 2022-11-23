<template>
  <b-container fluid class="h-100 m-0 p-0">
    <b-row>
      <div id="welcome" class="w-100 d-flex align-items-center welcome-bg">
        <b-row class="w-100 mx-0 my-5 px-3" align-v="center" align-h="center">
          <b-col md="12" lg="6" xl="5" class="text-left">
            <h1 class="section-title mb-3">Welcome to Port of Mars</h1>
            <p>
              Port of Mars is an online, game-based, social science experiment set on the first
              human community on the Red Planet. Currently in Open Beta, meaning anyone is welcome
              to participate.
            </p>
            <b-row class="mt-3">
              <b-col cols="5">
                <b-button class="w-100" variant="primary" :to="openlogin"
                  ><h4 class="p-1">Play Now</h4>
                </b-button>
              </b-col>
              <b-col cols="7">
                <p v-if="nextScheduledLaunch"><small>
                  <!-- FIXME: get this interval from the server after cleaning up shared settings -->
                  Games are scheduled to take place every 3 hours. Sign up to be ready when
                  the next round starts.
                </small></p>
              </b-col>
            </b-row>
          </b-col>
          <b-col md="12" lg="6" xl="5">
            <char-carousel></char-carousel>
          </b-col>
          <div class="w-100"></div>
          <b-col>
            <h2 v-if="nextScheduledLaunch" class="mb-3">Next Launch In</h2>
            <h2 v-else class="mb-3">No Games Scheduled</h2>
            <countdown
              v-if="nextScheduledLaunch"
              :nextLaunch="nextScheduledLaunch"
              style="color: #fff;"
            ></countdown>
          </b-col>
          <div class="w-100 mb-3"></div>
          <b-button variant="link" @click="scrollToNextSection">
            <p class="h1"><b-icon icon="chevron-down"></b-icon></p>
          </b-button>
        </b-row>
      </div>
      <div id="about" class="w-100 d-flex align-items-center about-bg" ref="nextSection">
        <b-row class="w-100 mx-0 my-5 px-3" align-v="center" align-h="center">
          <b-col md="12" lg="6" xl="5" class="text-left">
            <h1 class="section-title mb-3">About the Game</h1>
            <p class="text mb-3">
              You are 1 of 5 residents at the Port of Mars, the first long-term habitat on the
              planet. Each game consists of 8 — 12 rounds, each with phases of investing, trading,
              purchasing, discarding, and reacting to Mars events. Chance and player actions impact
              system health. If system health falls to zero all players die.
            </p>
          </b-col>
          <b-col md="12" lg="6" xl="5">
            <b-embed
              class="p-1"
              type="iframe"
              aspect="16by9"
              :src="trailerVideoUrl"
              allowfullscreen
            ></b-embed>
          </b-col>
        </b-row>
      </div>
    </b-row>
    <Footer></Footer>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Footer from "@port-of-mars/client/components/global/Footer.vue";
import Countdown from "@port-of-mars/client/components/global/Countdown.vue";
import CharCarousel from "@port-of-mars/client/components/global/CharCarousel.vue";
import Schedule from "@port-of-mars/client/components/dashboard/Schedule.vue";
import { LOGIN_PAGE, OPENLOGIN_PAGE, DASHBOARD_PAGE } from "@port-of-mars/shared/routes";
import { isDevOrStaging } from "@port-of-mars/shared/settings";

@Component({
  components: {
    CharCarousel,
    Footer,
    Countdown,
    Schedule
  }
})
export default class Home extends Vue {
  isDevMode: boolean = false;
  currentYear = new Date().getFullYear();
  trailerVideoUrl = "https://www.youtube.com/embed/D4FfofyrlkA";
  login = { name: LOGIN_PAGE };
  openlogin = { name: OPENLOGIN_PAGE };
  dashboardPage = { name: DASHBOARD_PAGE };
  readonly SITE_URL = "https://portofmars.asu.edu";

  get schedule() {
    return this.$tstore.state.scheduledGames;
  }

  get nextScheduledLaunch() {
    return this.schedule[0];
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
  }

  scrollToNextSection() {
    const el = this.$refs.nextSection as Element;
    if (el) {
      el.scrollIntoView({ block: "start", behavior: "smooth" });
    }
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

.welcome-bg {
  min-height: calc( 100vh - 85px );
  background: url("../assets/images/stars-bg.jpg") no-repeat;
  background-position: top; 
  background-size: cover;
  background-attachment: fixed;
}

.about-bg {
  background: var(--dark-shade);
}
</style>
