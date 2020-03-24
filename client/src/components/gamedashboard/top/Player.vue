<template>
  <div class="c-player">
    <div class="picture"></div>
    <div class="information">
      <p class="title">Your Role</p>
      <p class="role">Researcher</p>
      <p class="score">Score: 20</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  components: {}
})
export default class Player extends Vue {}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/top/Player.scss';
</style>
