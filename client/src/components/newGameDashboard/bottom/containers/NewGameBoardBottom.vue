<template>
  <div class="c-gameboardbottom container">
    <NewPhaseContainer />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import NewPhaseContainer from '@port-of-mars/client/components/newGameDashboard/bottom/containers/NewPhaseContainer.vue';

@Component({
  components: {
    NewPhaseContainer
  }
})
export default class NewGameBoardBottom extends Vue {}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/bottom/containers/NewGameBoardBottom.scss';
</style>
