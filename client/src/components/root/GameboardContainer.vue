<template>
  <b-container fluid class="h-100 m-0" style="background-color: var(--dark-shade)">
    <!--  ----------------------------------------
                     System Health
        ----------------------------------------
              HUD              | Mars Log /
        ---------------------- |
          Phase Switcher       | Chat
        ---------------------------------------- -->

    <b-row
      align-v="stretch"
      align-h="center"
      class="h-100 w-100 pt-5 pb-2"
      style="background-color: var(--dark-shade-75); overflow: hidden"
    >
      <ModalController></ModalController>
      <ProfileMenu></ProfileMenu>
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
      <SystemHealth class="fixed-top" style="z-index: 0"></SystemHealth>
      <b-col class="mx-0" cols="9">
        <b-row align="stretch" class="h-100 w-100 p-2">
          <b-col
            class="w-100 p-2 mx-0"
            style="height: 40%; border: 0.2rem solid rgba(241, 224, 197, 0.25)"
          >
            <HUD></HUD>
          </b-col>
          <div class="w-100 m-0 p-0"></div>
          <b-col
            class="w-100 p-2 mt-2 mx-0 tour-event tour-invest tour-trade tour-purchase"
            style="height: 60%; border: 0.2rem solid rgba(241, 224, 197, 0.25)"
          >
            <PhaseSwitcher></PhaseSwitcher>
          </b-col>
        </b-row>
      </b-col>
      <b-col class="mx-0" cols="3">
        <ChatMarsLog></ChatMarsLog>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Inject, Vue } from "vue-property-decorator";
import ModalController from "@port-of-mars/client/components/game/modals/ModalController.vue";
import HUD from "@port-of-mars/client/components/game/HUD.vue";
import PhaseSwitcher from "@port-of-mars/client/components/game/PhaseSwitcher.vue";
import ProfileMenu from "@port-of-mars/client/components/game/static/popups/ProfileMenu.vue";
import SystemHealth from "@port-of-mars/client/components/game/static/systemhealth/SystemHealth.vue";
import ChatMarsLog from "@port-of-mars/client/components/game/ChatMarsLog.vue";
import { GameRequestAPI } from "@port-of-mars/client/api/game/request";

@Component({
  components: {
    ModalController,
    HUD,
    PhaseSwitcher,
    ProfileMenu,
    SystemHealth,
    ChatMarsLog
  }
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

<style lang="scss" scoped>
.border {
  border: 0.5rem solid $light-shade-25;
}
</style>
