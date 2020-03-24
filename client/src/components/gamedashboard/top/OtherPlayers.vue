<template>
  <div class="c-otherplayers container">
    <div class="wrapper row">
      <div class="picture col-4">
        <div class="frame"></div>
      </div>
      <div class="information col-8">
        <p class="role">Entrepreneur</p>
        <p class="score">Score: 20</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  components: {}
})
export default class OtherPlayers extends Vue {}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/top/OtherPlayers.scss';
</style>
