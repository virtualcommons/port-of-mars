<template>
  <b-container fluid class="h-100 m-0 p-0 d-flex flex-column bg-dark">
    <b-row>
      <b-modal
        body-bg-variant="dark"
        body-text-variant="warning"
        centered
        no-close-on-backdrop
        no-close-on-esc
        no-enforce-focus
        header-bg-variant="dark"
        header-border-variant="dark"
        header-text-variant="warning"
        hide-footer
        hide-header-close
        title="Timeout Warning: Impending Bot Takeover"
        v-model="botWarning"
        variant="outline-warning"
      >
        <p>
          You have been inactive for at least four minutes. After five minutes a bot will takeover
          your player.
        </p>
        <b-button @click="resetBotWarning" block variant="warning">OK</b-button>
      </b-modal>
    </b-row>
    <b-row>
      <ProfileMenu />
    </b-row>

    <!--  ----------------------------------------
                     System Health
        ----------------------------------------
              HUD              | Mars Log /
        ---------------------- |
          Phase Switcher       | Chat
        ---------------------------------------- -->

    <!-- System Health -->
    <b-row class="flex-shrink-1 w-100">
      <SystemHealth></SystemHealth>
    </b-row>

    <!-- HUD, Phase Switcher, Mars Log, Chat -->
    <b-row class="flex-grow-1 w-100 my-2 mx-auto p-0">
      <b-col cols="9" class="d-flex flex-column w-100">
        <!-- HUD -->
        <b-row class="w-100 p-2 mx-0" style="border: 0.2rem solid rgba(241, 224, 197, 0.25)">
          <HUD></HUD>
        </b-row>
        <!-- Phase Switcher -->
        <b-row
          class="w-100 flex-grow-1 p-2 mt-2 mx-0"
          style="border: 0.2rem solid rgba(241, 224, 197, 0.25)"
        >
          <PhaseSwitcher></PhaseSwitcher>
        </b-row>
      </b-col>
      <!-- Chat | Mars Log -->
      <b-col cols="3" class="w-100">
        <ChatMarsLog></ChatMarsLog>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Inject, Vue } from "vue-property-decorator";
import HUD from "@port-of-mars/client/components/game/HUD.vue";
import PhaseSwitcher from "@port-of-mars/client/components/game/PhaseSwitcher.vue";
import ProfileMenu from "@port-of-mars/client/components/game/static/popups/ProfileMenu.vue";
import SystemHealth from "@port-of-mars/client/components/game/static/systemhealth/SystemHealth.vue";
import ChatMarsLog from "@port-of-mars/client/components/game/ChatMarsLog.vue";
import { GameRequestAPI } from "@port-of-mars/client/api/game/request";

@Component({
  components: {
    HUD,
    PhaseSwitcher,
    ProfileMenu,
    SystemHealth,
    ChatMarsLog,
  },
})
export default class GameboardContainer extends Vue {
  @Inject()
  api!: GameRequestAPI;

  get botWarning() {
    return this.$tstore.getters.player.botWarning;
  }

  resetBotWarning() {
    this.api.resetBotWarning();
  }
}
</script>

<style lang="scss">
.border {
  border: 0.5rem solid $light-shade-25;
}

body {
  color: $light-shade;
}
</style>
