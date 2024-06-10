<template>
  <b-container fluid class="h-100 m-0 p-0">
    <div>
      <TournamentBanner v-if="shouldShowTournamentBanner"></TournamentBanner>
      <AnnouncementBanner
        v-if="announcementBannerText"
        :text="announcementBannerText"
      ></AnnouncementBanner>
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
                <b-button
                  v-if="isFreePlayEnabled"
                  class="mt-3 mr-3"
                  size="md"
                  variant="primary"
                  :to="freePlayLobby"
                >
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
            <h1 class="section-title mb-3">The Game</h1>
            <p class="text mb-3">
              In Port of Mars, you play as one of five residents in Mars' first long-term habitat.
              You will navigate through several rounds of investing, trading, purchasing, and
              reacting to Mars Events with the goal achieving as many Victory Points as possible
              while keeping the community alive by maintaining System Health. Watch the tutorial
              video or check out the <b-link :to="manual">game manual</b-link> to learn more.
            </p>
            <h4 class="text-white mb-3">So how do I play?</h4>
            <p class="text mb-3">
              At any time, you can play Port of Mars in
              <b-link :to="freePlayLobby">free play mode</b-link> against bots or create a room to
              invite others to play with you. We also have a
              <b-link :to="solo">solo mode</b-link> version of the game which offers a more
              fast-paced experience. A few times a year we organize a "Mars Madness" tournament in
              which you can team up with others and compete for a variety of rewards including
              monetary awards. Gameplay outside of these organized tournaments is purely for fun.
            </p>
          </b-col>
          <b-col md="12" lg="6" xl="5" align-self="center">
            <b-embed
              class="p-1"
              type="iframe"
              aspect="16by9"
              :src="$settings.TUTORIAL_VIDEO_URL"
              allowfullscreen
            ></b-embed>
          </b-col>
          <div class="w-100 my-5"><hr /></div>
          <b-col md="12" lg="6" xl="5" align-self="center">
            <b-embed
              class="p-1"
              type="iframe"
              aspect="16by9"
              :src="$settings.TRAILER_VIDEO_URL"
              allowfullscreen
            ></b-embed>
          </b-col>
          <b-col md="12" lg="6" xl="5" class="text-left">
            <h1 class="section-title mb-3">The Project</h1>
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
          <div class="w-100 my-5"><hr /></div>
          <b-col md="12" lg="6" xl="5" class="text-left">
            <h1 class="section-title mb-3">Community</h1>
            <p class="text mb-3">
              Discuss the game, find a game to play, or connect with other players in our
              <a :href="$settings.DISCORD_URL">community Discord</a>.
            </p>
            <p class="text mb-3">
              Keep track of your performance with your
              <b-link :to="gameStats">personal stats page</b-link>
              or check out the
              <b-link :to="leaderboard">leaderboard</b-link>
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
  MANUAL_PAGE,
} from "@port-of-mars/shared/routes";
import Footer from "@port-of-mars/client/components/global/Footer.vue";
import CharCarousel from "@port-of-mars/client/components/global/CharCarousel.vue";
import AgeTooltip from "@port-of-mars/client/components/global/AgeTooltip.vue";
import LeaderboardTable from "@port-of-mars/client/components/stats/LeaderboardTable.vue";
import TournamentBanner from "@port-of-mars/client/components/global/TournamentBanner.vue";
import AnnouncementBanner from "@port-of-mars/client/components/global/AnnouncementBanner.vue";

@Component({
  components: {
    AgeTooltip,
    CharCarousel,
    Footer,
    LeaderboardTable,
    TournamentBanner,
    AnnouncementBanner,
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
  manual = { name: MANUAL_PAGE };

  get shouldShowTournamentBanner() {
    return this.$tstore.state.isTournamentEnabled && this.$tstore.getters.tournamentStatus;
  }

  get isFreePlayEnabled() {
    return this.$tstore.state.isFreePlayEnabled;
  }

  get announcementBannerText() {
    return this.$tstore.state.announcementBannerText;
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
