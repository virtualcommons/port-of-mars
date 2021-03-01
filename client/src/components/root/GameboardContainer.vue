<template>
  <b-container fluid class="h-100 p-5 m-0" :style="'background-color: $dark-shade'">
    <ModalController />
    <ProfileMenu />
    <b-row class="w-100">
      <SystemHealth />
    </b-row>
    <b-row class="h-100 flex-grow-1 p-0 m-0 overflow-hidden">
      <b-col cols="9" class="h-100 align-items-center">
        <b-row class="w-100" :style="'height: 40%'">
          <HUD/>
        </b-row>
        <b-row class="p-3" :style="'height: 60%; border: 0.2rem solid rgba(241, 224, 197, 0.25); '">
          <PhaseSwitcher />
        </b-row>
      </b-col>
      <b-col cols="3" class="w-100 h-100">
        <ChatMarsLog/>
      </b-col>
    </b-row>
    <b-modal body-bg-variant="dark" body-text-variant="warning" centered no-close-on-backdrop no-close-on-esc no-enforce-focus
             header-bg-variant="dark" header-border-variant="dark" header-text-variant="warning" hide-footer
             hide-header-close title="Timeout Warning: Impending Bot Takeover" v-model="botWarning"
             variant="outline-warning">
      <p>You have been inactive for at least four minutes. After five minutes a bot will takeover
        your player.</p>
      <b-button @click="resetBotWarning" block variant="warning">OK</b-button>
    </b-modal>
  </b-container>
</template>

<script lang="ts">
  import {Component, Inject, Vue} from 'vue-property-decorator';
  import ModalController from '@port-of-mars/client/components/game/modals/ModalController.vue';
  import HUD from '@port-of-mars/client/components/game/HUD.vue';
  import PhaseSwitcher from '@port-of-mars/client/components/game/PhaseSwitcher.vue';
  import ProfileMenu from '@port-of-mars/client/components/game/static/popups/ProfileMenu.vue';
  import SystemHealth
    from '@port-of-mars/client/components/game/static/systemhealth/SystemHealth.vue';
  import ChatMarsLog from '@port-of-mars/client/components/game/ChatMarsLog.vue';
  import {GameRequestAPI} from "@port-of-mars/client/api/game/request";

  @Component({
    components: {
      ModalController,
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

<style lang="scss" scoped>
.border {
  border: 0.5rem solid $light-shade-25;
}
</style>
