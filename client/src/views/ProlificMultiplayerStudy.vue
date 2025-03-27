<template>
  <div class="backdrop d-flex justify-content-center align-items-center">
    <b-container
      class="h-100 solo-dashboard-container content-container p-4 d-flex flex-column justify-content-center align-items-center text-center"
      style="width: auto; max-width: 60%; height: auto; max-height: 60%"
      no-gutters
    >
      <Splash
        v-if="!started && !isStudyComplete"
        @begin="begin"
        @pressed-start="handlePressedStart"
        :instructions="participantStatus.nextGameInstructions"
      />
    </b-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Splash from "@port-of-mars/client/components/triogame/Splash.vue";
import { LITE_LOBBY_PAGE } from "@port-of-mars/shared/routes";

@Component({
  name: "MultiplayerStudy",
  components: {
    Splash,
  },
})
export default class ProlificMultiplayerStudy extends Vue {
  started = false;
  isStudyComplete = false;

  participantStatus = {
    progress: {
      max: 100,
      current: 50,
      label: "50%",
    },
    nextGameInstructions:
      "Collaborate with other players to manage your habitat and achieve your goals.",
  };

  begin() {
    console.log("Game started!");
    this.started = true;
  }

  handlePressedStart() {
    this.$router.push({ name: LITE_LOBBY_PAGE });
  }
}
</script>
