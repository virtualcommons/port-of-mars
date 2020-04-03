<template>
  <div class="gameboardcontainer container">
    <div class="gameboardstatusbar row">
      <SystemHealth />
    </div>
    <div class="gameboardcontainerrow row no-gutters">
      <div class="gameboard-wrapper col-9">
        <ProfileMenu />
        <div class="gameboardtop row">
          <Header />
        </div>
        <div class="gameboardbottom row">
          <GameBoardRoot />
        </div>
        <ActiveEventsPopup />
        <InventoryPopup />
      </div>
      <div class="chatwrapper col-3">
        <Chat/>
      </div>
    </div>
</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Header from '@port-of-mars/client/components/game/static/Header.vue';
import GameBoardRoot from '@port-of-mars/client/components/game/phases/GameBoardRoot.vue';
import ProfileMenu from '@port-of-mars/client/components/game/static/popups/ProfileMenu.vue';
import ActiveEventsPopup from '@port-of-mars/client/components/game/static/popups/ActiveEventsPopup.vue';
import InventoryPopup from '@port-of-mars/client/components/game/static/popups/InventoryPopup.vue';
import Chat from '@port-of-mars/client/components/game/static/chat/Chat.vue'
import SystemHealth from '@port-of-mars/client/components/game/static/systemhealth/SystemHealth.vue';

@Component({
  components: {
    Header,
    GameBoardRoot,
    ProfileMenu,
    ActiveEventsPopup,
    InventoryPopup,
    Chat,
    SystemHealth,
  }
})
export default class GameboardContainer extends Vue {}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/root/GameboardContainer.scss';
</style>
