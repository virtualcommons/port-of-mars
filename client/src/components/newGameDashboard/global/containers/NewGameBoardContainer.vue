<template>
  <div class="gameboardcontainer container">
    <ProfileMenu />
    <div class="gameboardtop row">
      <NewGameBoardTop />
    </div>
    <div class="gameboardbottom row">
      <NewGameBoardBottom />
    </div>
    <ActiveEventsPopup v-show="shouldShowEvents"/>
    <InventoryPopup />
    <ChatPopup v-show="shouldShowChat"  />
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
import { Phase } from '@port-of-mars/shared/types';

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
export default class NewGameBoardContainer extends Vue {

  get gamePhase(){
    return this.$tstore.state.phase;
  }

  get phase(){
    return Phase;
  }
  get shouldShowChat(){
    return this.gamePhase === this.phase.invest;
  }

  get shouldShowEvents(){
    return this.gamePhase != this.phase.events;
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/global/containers/NewGameBoardContainer.scss';
</style>
