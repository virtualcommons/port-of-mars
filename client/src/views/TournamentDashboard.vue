<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 backdrop">
    <div class="h-100 w-100 d-flex flex-column">
      <Messages class="p-3"></Messages>
      <b-row class="h-100 w-100 mx-auto flex-grow-1 p-5" style="max-width: 1400px">
        <b-col cols="6" class="h-100 d-flex flex-column justify-content-between">
          <span v-if="!expandSchedule" class="mb-3">
            <h4>Mars Madness Tournament {{ new Date().getFullYear() }}</h4>
            <p>{{ status?.description }}</p>
          </span>
          <div class="overflow-auto">
            <div class="d-flex">
              <h4>Round {{ status?.currentRound.round }} Schedule</h4>
              <b-button variant="link" @click="expandSchedule = !expandSchedule">
                <span v-if="expandSchedule">
                  Show Tournament Info
                  <b-icon-chevron-down shift-v="4"></b-icon-chevron-down>
                </span>
                <span v-else>
                  Expand
                  <b-icon-chevron-up shift-v="4"></b-icon-chevron-up>
                </span>
              </b-button>
            </div>
            <p v-if="!$tstore.getters.tournamentRoundHasUpcomingLaunch">
              No scheduled launch times
            </p>
            <Schedule :schedule="$tstore.getters.tournamentSchedule" />
          </div>
        </b-col>
        <b-col cols="6" class="content-container h-100">
          <div
            v-if="invite && !invite.hasParticipated"
            class="h-100 d-flex flex-column justify-content-around align-items-center py-5"
          >
            <TournamentOnboardingSteps
              :invite="invite"
              class="flex-grow-1"
            ></TournamentOnboardingSteps>
            <b-button
              variant="success"
              size="lg"
              class="my-5 py-3 px-4"
              :disabled="isJoinLobbyDisabled"
              :to="tournamentLobby"
              ><h4 class="mb-0">Join the Tournament Lobby</h4>
            </b-button>
            <span v-if="!isLobbyOpen" class="mb-5">
              <h4 class="text-center">Next Launch In</h4>
              <Countdown :nextLaunch="$tstore.getters.nextLaunchTime" />
            </span>
            <span v-else></span>
          </div>
          <div v-else class="h-100 d-flex flex-column justify-content-center align-items-center">
            <b-alert show v-if="loaded" variant="danger" class="mx-5">
              <h4><b-icon-exclamation-circle></b-icon-exclamation-circle></h4>
              <span v-if="invite?.hasParticipated">
                You have already participated in the current tournament round.
              </span>
              <span v-else>
                We couldn't find your invitation for the current tournament round. If this appears
                to be a mistake please contact us at
                <a :href="`mailto:${constants.CONTACT_EMAIL}`">{{ constants.CONTACT_EMAIL }}</a
                >.
              </span>
            </b-alert>
            <b-spinner v-else></b-spinner>
            <b-button
              v-if="invite?.hasParticipated && !invite.hasCompletedExitSurvey"
              variant="success"
              size="lg"
              :href="invite.exitSurveyUrl"
            >
              <h4 class="mb-0">Take Exit Survey</h4>
            </b-button>
          </div>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Provide, Vue } from "vue-property-decorator";
import { TournamentAPI } from "@port-of-mars/client/api/tournament/request";
import { HOME_PAGE, MANUAL_PAGE, TOURNAMENT_LOBBY_PAGE } from "@port-of-mars/shared/routes";
import { TournamentRoundInviteStatus } from "@port-of-mars/shared/types";
import { Constants } from "@port-of-mars/shared/settings";
import Countdown from "@port-of-mars/client/components/global/Countdown.vue";
import Messages from "@port-of-mars/client/components/global/Messages.vue";
import Schedule from "@port-of-mars/client/components/global/Schedule.vue";
import TournamentOnboardingSteps from "@port-of-mars/client/components/global/TournamentOnboardingSteps.vue";

@Component({
  components: {
    Countdown,
    Messages,
    Schedule,
    TournamentOnboardingSteps,
  },
})
export default class TournamentDashboard extends Vue {
  tournamentLobby = { name: TOURNAMENT_LOBBY_PAGE };
  manual = { name: MANUAL_PAGE };
  home = { name: HOME_PAGE };
  @Provide() api!: TournamentAPI;

  invite: TournamentRoundInviteStatus | null = null;
  loaded = false;
  expandSchedule = false;

  get constants() {
    return Constants;
  }

  get isJoinLobbyDisabled() {
    return (
      !this.isLobbyOpen ||
      !this.$tstore.getters.hasConsented ||
      !this.invite?.hasCompletedIntroSurvey
    );
  }

  get isLobbyOpen() {
    return this.$tstore.getters.isTournamentLobbyOpen;
  }

  get status() {
    return this.$tstore.getters.tournamentStatus;
  }

  async created() {
    this.api = new TournamentAPI(this.$tstore, this.$ajax);
    this.invite = await this.api.getInviteStatus();
    this.loaded = true;
  }
}
</script>

<style lang="scss" scoped></style>
