<template>
  <div class="c-gameinformation">
    <div class="section">
      <p class="title">Round</p>
      <p class="round">1 of 5</p>
    </div>
    <div class="section">
      <p class="title">Current Phase</p>
      <p class="phase">Investment</p>
    </div>
    <div class="section">
      <p class="title">Phase Countdown</p>
      <p class="countdown">4:32</p>
    </div>
    <div class="section">
      <button>Ready to Advance</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  components: {}
})
export default class GameInformation extends Vue {}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/top/GameInformation.scss';
</style>
