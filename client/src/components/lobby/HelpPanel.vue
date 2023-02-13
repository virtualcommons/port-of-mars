<template>
  <div id="tutorial" class="h-100 d-flex flex-column justify-content-between">
    <div id="text">
      <h4>How to Play</h4>
      <p>
        Each round of a game consists of multiple phases for investing, trading with other players,
        purchasing accomplishments, and reacting to Mars Events. Your goal is to score victory
        points through accomplishments, while maintaining the vital infrastructure keeping the
        community alive by investing in system health.
      </p>

      <p>
        Individual choices, collective actions, and chance will affect the outcome of the game. For
        more information, see the game manual or short tutorial video below.
      </p>
    </div>
    <div id="links">
      <b-button :to="manual" target="_blank" size="lg" variant="primary" class="w-100 mb-4">
        <h4>Game Manual</h4>
      </b-button>
      <b-embed
        id="tutorialVideo"
        type="iframe"
        aspect="16by9"
        :src="constants.TUTORIAL_VIDEO_URL"
        allowfullscreen
      ></b-embed>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { MANUAL_PAGE } from "@port-of-mars/shared/routes";
import { Constants } from "@port-of-mars/shared/settings";

@Component({})
export default class HelpPanel extends Vue {
  manual = { name: MANUAL_PAGE };

  get constants() {
    return Constants;
  }
}
</script>

<style lang="scss" scoped></style>
