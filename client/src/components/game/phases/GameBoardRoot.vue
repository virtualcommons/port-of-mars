<template>
  <div class="c-gameboardbottom container">
    <ContainerPhase />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ContainerPhase from './ContainerPhase.vue';

@Component({
  components: {
    ContainerPhase
  }
})
export default class GameBoardRoot extends Vue {}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/GameBoardRoot.scss';
</style>
