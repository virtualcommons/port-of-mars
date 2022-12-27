<template>
  <b-container fluid class="h-100 m-0 p-0">
    <b-row>
      <div id="welcome" class="w-100 d-flex align-items-center welcome">
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
                <b-button class="w-100" variant="primary" :to="login"
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
          <b-button variant="link" @click="scrollToAboutSection">
            <p class="h1"><b-icon icon="chevron-down"></b-icon></p>
          </b-button>
        </b-row>
      </div>
      <div id="about" class="w-100 d-flex align-items-center about" ref="aboutSection">
        <b-row class="w-100 mx-0 my-5 px-3" align-v="start" align-h="center">
          <div class="w-100 mt-5"></div>
          <b-col md="12" lg="12" xl="10" class="text-left">
            <h1 class="section-title mb-3">Port of Mars: Digital Version</h1>
            <p class="text mb-3">
              Port of Mars is an interdisciplinary research project sponsored by the
              <a href="https://interplanetary.asu.edu/">Interplanetary Initiative</a> at
              <a href="https://www.asu.edu/" target="_blank">Arizona State University</a>.
              Its original incarnation was designed and implemented as a physical card game for 5
              players. We are developing a digital version of the Port of Mars game to serve as a
              scalable research testbed for studying collective action.
            </p>
            <p class="text mb-3">
              Previously, the game was only open to ASU students to participate in double-elimination
              "Mars Madness" tournaments. We are now entering into an Open Beta phase, where anyone
              around the world can participate.
            </p>
          </b-col>
          <div class="w-100 my-5"></div>
          <b-col md="12" lg="6" xl="5" class="text-left">
            <h1 class="section-title mb-3">Gameplay</h1>
            <p class="text mb-3">
              You are 1 of 5 residents at the Port of Mars, the first long-term habitat on the
              planet. Each game consists of 8 — 12 rounds, each with phases of investing, trading,
              purchasing, discarding, and reacting to Mars events. Chance and player actions impact
              system health. If system health falls to zero all players die.
            </p>
            <p class="text mb-3">
              Your mission is to stay alive and achieve the most victory points. Each round you
              receive time blocks that you can invest in system health or resources that can be
              used to purchase accomplishments. System health will maintain the shared
              infrastructure and keep the team alive, while accomplishments will earn you victory points.
            </p>
          </b-col>
          <b-col md="12" lg="6" xl="5">
            <b-embed
              class="p-1"
              type="iframe"
              aspect="16by9"
              :src="constants.TRAILER_VIDEO_URL"
              allowfullscreen
            ></b-embed>
          </b-col>
          <div class="w-100 my-5"></div>
          <b-col md="12" lg="6" xl="5">
            <b-embed
              class="p-1"
              type="iframe"
              aspect="16by9"
              :src="constants.INTRO_VIDEO_URL"
              allowfullscreen
            ></b-embed>
          </b-col>
          <b-col md="12" lg="6" xl="5" class="text-left">
            <h1 class="section-title mb-3">About the Project</h1>
            <p class="text mb-3">
              We're researching effective strategies for navigating dilemmas of shared resources,
              common good, and collective action under conditions of high uncertainty and high risk,
              like those in space. Players are citizens of an early Martian community charged with
              working together to provide for the sustained welfare of the settlement. All player
              actions are tracked and analyzed. We examine what behaviors tend to produce success,
              and what tends to produce failure. Each instance of gameplay is a simulation, a
              modeling exercise for future human space communities.
            </p>
          </b-col>
          <div class="w-100 mb-5"></div>
        </b-row>
      </div>
    </b-row>
    <Footer></Footer>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Footer from "@port-of-mars/client/components/global/Footer.vue";
import Countdown from "@port-of-mars/client/components/global/Countdown.vue";
import CharCarousel from "@port-of-mars/client/components/global/CharCarousel.vue";
import Schedule from "@port-of-mars/client/components/dashboard/Schedule.vue";
import { LOGIN_PAGE } from "@port-of-mars/shared/routes";
import { isDevOrStaging, Constants } from "@port-of-mars/shared/settings";

@Component({
  components: {
    CharCarousel,
    Footer,
    Countdown,
    Schedule
  }
})
export default class Home extends Vue {
  @Prop({ default: false })
  scrollToAbout!: boolean;  

  isDevMode: boolean = false;
  currentYear = new Date().getFullYear();
  login = { name: LOGIN_PAGE };

  get constants() {
    return Constants;
  }

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
    this.isDevMode = isDevOrStaging();
    if (this.scrollToAbout) {
      this.scrollToAboutSection();
    }
  }

  scrollToAboutSection() {
    const el = this.$refs.aboutSection as Element;
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

.welcome {
  min-height: calc( 100vh - 85px );
  background: url("../assets/images/stars-bg.jpg") no-repeat;
  background-position: top; 
  background-size: cover;
  background-attachment: fixed;
}

.about {
  background: rgba(45, 37, 36, 1);
  .text {
    line-height: 1.75;
  }
}
</style>
