<template>
  <div class="c-gameboardbottom container">
    <NewPhaseContainer />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import NewPhaseContainer from './phases/NewPhaseContainer.vue';

@Component({
  components: {
    NewPhaseContainer
  }
})
export default class NewGameBoardBottom extends Vue {}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/GameDashboardPhases/NewGameBoardBottom.scss';
</style>
