<template>
  <div class="d-flex flex-column justify-content-between">
    <div class="d-flex align-items-center flex-shrink-1">
      <div class="flex-shrink-1 mr-5">
        <h2 class="mb-0">
          <b-icon-check-circle v-if="hasConsented" variant="success"></b-icon-check-circle>
          <b-icon-x-circle v-else variant="secondary"></b-icon-x-circle>
        </h2>
      </div>
      <div class="flex-grow-1">
        <b-button variant="primary" :disabled="hasConsented" :to="consent" class="w-100"
          ><h4 class="mb-0">Grant Consent</h4></b-button
        >
      </div>
    </div>
    <div class="line"></div>
    <div class="d-flex align-items-center">
      <div class="flex-shrink-1 mr-5">
        <h2 class="mb-0">
          <b-icon-check-circle
            v-if="invite.hasCompletedIntroSurvey"
            variant="success"
          ></b-icon-check-circle>
          <b-icon-x-circle v-else variant="secondary"></b-icon-x-circle>
        </h2>
      </div>
      <div class="flex-grow-1">
        <b-button
          variant="primary"
          :disabled="invite.hasCompletedIntroSurvey"
          :href="invite.introSurveyUrl"
          class="w-100"
          ><h4 class="mb-0">Take Intro Survey</h4></b-button
        >
      </div>
    </div>
    <b-button v-if="isDevMode" variant="link" :href="skipSurveyUrl"
      >Skip survey (test mode)</b-button
    >
    <div class="line"></div>
    <div class="d-flex align-items-center">
      <div class="flex-shrink-1 mr-5">
        <h2 class="mb-0">
          <b-icon-circle variant="secondary"></b-icon-circle>
        </h2>
      </div>
      <div class="flex-grow-1">
        <h4>Learn How to Play</h4>
        <b-button-group size="sm">
          <b-button variant="secondary" :to="manual" target="_blank">Read the manual</b-button>
          <b-button variant="primary" :href="$settings.TUTORIAL_VIDEO_URL" target="_blank"
            >Watch the tutorial</b-button
          >
        </b-button-group>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { CONSENT_PAGE, MANUAL_PAGE } from "@port-of-mars/shared/routes";
import { TournamentRoundInviteStatus } from "@port-of-mars/shared/types";
import { Component, Prop, Vue } from "vue-property-decorator";
import { isDevOrStaging } from "@port-of-mars/shared/settings";
import { url } from "@port-of-mars/client/util";

@Component({})
export default class TournamentOnboardingSteps extends Vue {
  @Prop()
  invite!: TournamentRoundInviteStatus;

  isDevMode = false;
  consent = { name: CONSENT_PAGE };
  manual = { name: MANUAL_PAGE };

  get status() {
    return this.$tstore.getters.tournamentStatus;
  }

  get hasConsented() {
    return this.$store.getters.hasConsented;
  }

  get skipSurveyUrl() {
    return url(`/tournament/survey/complete?tid=${this.invite.id}`);
  }

  created() {
    this.isDevMode = isDevOrStaging();
  }
}
</script>

<style lang="scss" scoped>
.line {
  flex-grow: 1;
  border: 2px solid rgba(255, 255, 255, 0.25);
  width: 0;
  margin: 0.8rem;
}
</style>
