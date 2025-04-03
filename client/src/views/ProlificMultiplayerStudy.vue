<template>
  <div class="backdrop d-flex justify-content-center align-items-center">
    <Messages class="p-3"></Messages>
    <b-container
      class="h-100 solo-dashboard-container content-container p-4 d-flex flex-column justify-content-center align-items-center text-center"
      style="width: auto; max-width: 60%; height: auto; max-height: 60%"
      no-gutters
    >
      <Splash v-if="!started && !isStudyComplete" @pressed-start="handlePressedStart" />
    </b-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { LITE_LOBBY_PAGE } from "@port-of-mars/shared/routes";
import Splash from "@port-of-mars/client/components/lite/multiplayer/Splash.vue";
import Messages from "@port-of-mars/client/components/global/Messages.vue";

@Component({
  name: "MultiplayerStudy",
  components: {
    Splash,
    Messages,
  },
})
export default class ProlificMultiplayerStudy extends Vue {
  started = false;
  isStudyComplete = false;

  async created() {
    // TODO:
    // - make sure user is a participant
    // - if user has completed study, give link to return to prolific
  }

  handlePressedStart() {
    this.$router.push({ name: LITE_LOBBY_PAGE });
  }
}
</script>
