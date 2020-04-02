<template>
  <div class="gameboardcontainer container">
    <div class="gameboardstatusbar row">
      <NewSystemHealth />
    </div>
    <div class="gameboardcontainerrow row no-gutters">
      <div class="gameboard-wrapper col-9">
        <ProfileMenu />
        <div class="gameboardtop row">
          <NewGameBoardTop />
        </div>
        <div class="gameboardbottom row">
          <NewGameBoardBottom />
        </div>
        <ActiveEventsPopup />
        <InventoryPopup />
      </div>
      <div class="chatwrapper col-3">
        <NewChat/>
      </div>
    </div>
</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import NewGameBoardTop from '@port-of-mars/client/components/GameDashboardStatic/NewGameBoardTop.vue';
import NewGameBoardBottom from '@port-of-mars/client/components/GameDashboardPhases/NewGameBoardBottom.vue';
import ProfileMenu from '@port-of-mars/client/components/GameDashboardStatic/popups/ProfileMenu.vue';
import ActiveEventsPopup from '@port-of-mars/client/components/GameDashboardStatic/popups/ActiveEventsPopup.vue';
import InventoryPopup from '@port-of-mars/client/components/GameDashboardStatic/popups/InventoryPopup.vue';
import NewChat from '@port-of-mars/client/components/GameDashboardStatic/chat/NewChat.vue'
import NewSystemHealth from '@port-of-mars/client/components/GameDashboardStatic/systemHealth/NewSystemHealth.vue';

@Component({
  components: {
    NewGameBoardTop,
    NewGameBoardBottom,
    ProfileMenu,
    ActiveEventsPopup,
    InventoryPopup,
    NewChat,
    NewSystemHealth,
  }
})
export default class GameboardContainer extends Vue {}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/rootContainers/GameboardContainer.scss';
</style>
