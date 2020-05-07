<template>
  <div class="c-gameboard-container container">
    <ModalController />
    <ProfileMenu />
    <div class="system-health row">
      <SystemHealth />
    </div>
    <div class="gameboard row">
      <div class="left col-9">
        <div class="hud row">
          <HUD />
        </div>
        <div class="phase-switcher row">
          <PhaseSwitcher />
        </div>
      </div>
      <div class="right col-3">
        <ChatMarsLog />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ModalController from '@port-of-mars/client/components/game/modals/ModalController.vue';
import HUD from '@port-of-mars/client/components/game/HUD.vue';
import PhaseSwitcher from '@port-of-mars/client/components/game/PhaseSwitcher.vue';
import ProfileMenu from '@port-of-mars/client/components/game/static/popups/ProfileMenu.vue';
import SystemHealth from '@port-of-mars/client/components/game/static/systemhealth/SystemHealth.vue';
import ChatMarsLog from '@port-of-mars/client/components/game/ChatMarsLog.vue';

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
export default class GameboardContainer extends Vue {}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/root/GameboardContainer.scss';
</style>
