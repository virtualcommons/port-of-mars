<template>
  <div class="c-gameboardbottom container">
    <PhaseContainer />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import PhaseContainer from './PhaseContainer.vue';

@Component({
  components: {
    PhaseContainer
  }
})
export default class GameBoardBottom extends Vue {}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/GameBoardBottom.scss';
</style>
