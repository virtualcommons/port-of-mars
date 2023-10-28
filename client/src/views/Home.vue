<template>
  <b-container fluid class="h-100 m-0 p-0">
    <div>
      <TournamentBanner v-if="shouldShowTournamentBanner"></TournamentBanner>
      <div id="welcome" class="w-100 d-flex align-items-center welcome">
        <b-row class="w-100 mx-0 my-5 px-3" align-v="center" align-h="center">
          <b-col md="12" lg="6" xl="5" class="text-left">
            <h1 class="section-title mb-3">Welcome to Port of Mars</h1>
            <p>
              Port of Mars is an online, game-based, social science experiment set on the first
              human community on the Red Planet. We are now in an open beta where anyone aged 18 and
              over<AgeTooltip placement="right" /> can participate.
            </p>
            <b-row class="mt-3">
              <b-col>
                <b-button class="mt-3 mr-3" size="md" variant="secondary" :to="solo">
                  <h4 class="p-1">Solo Mode</h4>
                </b-button>
                <b-button class="mt-3 mr-3" size="md" variant="primary" :to="freePlayLobby">
                  <h4 class="p-1">Free Play</h4>
                </b-button>
                <b-button
                  class="mt-3"
                  size="md"
                  v-if="shouldShowTournamentBanner"
                  variant="success"
                  :to="tournamentDashboard"
                >
                  <h4 class="p-1">Join Mars Madness</h4>
                </b-button>
              </b-col>
            </b-row>
          </b-col>
          <b-col md="12" lg="6" xl="5">
            <char-carousel></char-carousel>
          </b-col>
          <div class="w-100 mb-3"></div>
          <b-button variant="link" @click="scrollToAboutSection">
            <h1><b-icon-chevron-down></b-icon-chevron-down></h1>
          </b-button>
        </b-row>
      </div>
      <div id="about" class="w-100 d-flex align-items-center about" ref="aboutSection">
        <b-row class="w-100 mx-0 my-5 px-3" align-v="start" align-h="center">
          <div class="w-100 mt-5"></div>
          <b-col md="12" lg="6" xl="5" class="text-left">
            <h1 class="section-title mb-3">About</h1>
            <p class="text mb-3">
              Port of Mars is an interdisciplinary research project sponsored by the
              <a href="https://interplanetary.asu.edu/">Interplanetary Initiative</a> at
              <a href="https://www.asu.edu/" target="_blank">Arizona State University</a>. Its
              original incarnation was designed and implemented as a physical card game for 5
              players. This application is a digital version of the Port of Mars card game that
              serves as a scalable and evolving research testbed to study collective action.
            </p>
            <p class="text mb-3">
              We're researching effective strategies for navigating dilemmas of shared resources,
              common good, and collective action under conditions of high uncertainty and high risk,
              like those in space. Players are citizens of an early Martian community charged with
              working together to provide for the sustained welfare of the settlement. All player
              actions are tracked, allowing researchers to analyze and examine the behaviors that
              tend to produce success or failure. Each individual game is a simulation and modeling
              exercise for future human space communities.
            </p>
          </b-col>
          <b-col md="12" lg="6" xl="5" align-self="center">
            <b-embed
              class="p-1"
              type="iframe"
              aspect="16by9"
              :src="constants.TRAILER_VIDEO_URL"
              allowfullscreen
            ></b-embed>
          </b-col>
          <div class="w-100 my-5"><hr /></div>
          <b-col md="12" lg="6" xl="5" align-self="center">
            <b-embed
              class="p-1"
              type="iframe"
              aspect="16by9"
              :src="constants.TUTORIAL_VIDEO_URL"
              allowfullscreen
            ></b-embed>
          </b-col>
          <b-col md="12" lg="6" xl="5" class="text-left">
            <h1 class="section-title mb-3">Gameplay</h1>
            <p class="text mb-3">
              You are 1 of 5 residents at the Port of Mars, the first long-term habitat on the
              planet. Each game consists of 8 — 12 rounds, and each round has phases for investing,
              trading, purchasing, discarding, and reacting to Mars Events. Chance and player
              actions impact System Health. If System Health falls to zero everyone in the community
              dies.
            </p>
            <p class="text mb-3">
              Your mission is to stay alive and achieve as many Victory Points as you can. In each
              round you will receive time blocks that you can invest in System Health or Influence
              resources that can be used to purchase Accomplishments. System Health will maintain
              the shared infrastructure and keep your community alive, while Accomplishments will
              earn you the Victory Points necessary to win the game.
            </p>
          </b-col>
          <div class="w-100 my-5"><hr /></div>
          <b-col md="12" lg="6" xl="5" class="text-left">
            <h1 class="section-title mb-3">Community</h1>
            <p class="text mb-3">
              Discuss the game, find a game to play, or connect with other players in our
              <a :href="constants.DISCORD_URL">community Discord</a> or by joining a room in our
              <b-link :to="freePlayLobby">free play lobby</b-link> and using the built-in chat.
            </p>
            <p class="text mb-3">
              Keep track of your performance with your
              <b-link :to="gameStats">personal stats page</b-link> and visit the
              <b-link :to="leaderboard">full leaderboard</b-link>
              to see how you stack up against other players.
            </p>
          </b-col>
          <b-col md="12" lg="6" xl="5" align-self="center">
            <h4 class="mb-2 text-white">Top Players</h4>
            <div class="bg-dark p-3">
              <LeaderboardTable
                :showWithBots="false"
                :showgameStats="false"
                :limit="10"
                maxHeight="300px"
              ></LeaderboardTable>
            </div>
          </b-col>
        </b-row>
      </div>
    </div>
    <Footer></Footer>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  LEADERBOARD_PAGE,
  FREE_PLAY_LOBBY_PAGE,
  PLAYER_HISTORY_PAGE,
  SOLO_GAME_PAGE,
  TOURNAMENT_DASHBOARD_PAGE,
} from "@port-of-mars/shared/routes";
import { Constants } from "@port-of-mars/shared/settings";
import Footer from "@port-of-mars/client/components/global/Footer.vue";
import CharCarousel from "@port-of-mars/client/components/global/CharCarousel.vue";
import AgeTooltip from "@port-of-mars/client/components/global/AgeTooltip.vue";
import LeaderboardTable from "@port-of-mars/client/components/stats/LeaderboardTable.vue";
import TournamentBanner from "@port-of-mars/client/components/global/TournamentBanner.vue";

@Component({
  components: {
    AgeTooltip,
    CharCarousel,
    Footer,
    LeaderboardTable,
    TournamentBanner,
  },
})
export default class Home extends Vue {
  @Prop({ default: false })
  scrollToAbout!: boolean;

  currentYear = new Date().getFullYear();
  freePlayLobby = { name: FREE_PLAY_LOBBY_PAGE };
  tournamentDashboard = { name: TOURNAMENT_DASHBOARD_PAGE };
  leaderboard = { name: LEADERBOARD_PAGE };
  gameStats = { name: PLAYER_HISTORY_PAGE };
  solo = { name: SOLO_GAME_PAGE };

  get constants() {
    return Constants;
  }

  get shouldShowTournamentBanner() {
    return this.$tstore.state.isTournamentEnabled && this.$store.getters.tournamentStatus;
  }

  async mounted() {
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
  min-height: calc(100vh - 85px);
  background: url("../assets/images/stars-bg.jpg") no-repeat;
  background-position: top;
  background-size: cover;
  background-attachment: fixed;
}

.about {
  background: rgba(45, 37, 36, 1);
  .text {
    line-height: 2;
  }
}
</style>
