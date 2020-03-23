<template>
  <div class="gameboardcontainer container">
    <ProfileMenu />
    <div class="gameboardtop row">top</div>
    <div class="gameboardbottom row">
      <NewGameBoardBottom />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import NewGameBoardBottom from '@port-of-mars/client/components/gamedashboard/bottom/containers/NewGameBoardBottom.vue';
import ProfileMenu from '@port-of-mars/client/components/gamedashboard/global/ProfileMenu.vue';

@Component({
  components: {
    NewGameBoardBottom,
    ProfileMenu
  }
})
export default class NewGameBoardContainer extends Vue {}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/global/containers/NewGameBoardContainer.scss';
</style>
