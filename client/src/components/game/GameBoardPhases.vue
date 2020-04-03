<template>
  <div class="c-gameboardbottom container">
    <Phases />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Phases from './phases/Phases.vue';

@Component({
  components: {
    Phases
  }
})
export default class GameBoardPhases extends Vue {}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/GameBoardPhases.scss';
</style>
