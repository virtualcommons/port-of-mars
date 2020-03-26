<template>
  <div class="gameboardcontainer container">
    <ProfileMenu />
    <div class="gameboardtop row">
      <NewGameBoardTop />
    </div>
    <div class="gameboardbottom row">
      <NewGameBoardBottom />
    </div>
    <ActiveEventsPopup />
    <InventoryPopup />
    <ChatPopup />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import NewGameBoardTop from '@port-of-mars/client/components/newGameDashboard/top/containers/NewGameBoardTop.vue';
import NewGameBoardBottom from '@port-of-mars/client/components/newGameDashboard/bottom/containers/NewGameBoardBottom.vue';
import ProfileMenu from '@port-of-mars/client/components/newGameDashboard/global/ProfileMenu.vue';
import ActiveEventsPopup from '@port-of-mars/client/components/newGameDashboard/global/ActiveEventsPopup.vue';
import InventoryPopup from '@port-of-mars/client/components/newGameDashboard/global/InventoryPopup.vue';
import ChatPopup from '@port-of-mars/client/components/newGameDashboard/global/ChatPopup.vue';

@Component({
  components: {
    NewGameBoardTop,
    NewGameBoardBottom,
    ProfileMenu,
    ActiveEventsPopup,
    InventoryPopup,
    ChatPopup
  }
})
export default class NewGameBoardContainer extends Vue {}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/global/containers/NewGameBoardContainer.scss';
</style>
