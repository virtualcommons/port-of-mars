<template>
  <div class="player">
    <div class="ready" v-if="ready"></div>
    <div class="p-container" :style="{ 'background-color': `var(--color-${role})` }">
      <div class="score-and-role">
        <p class="score">{{ victoryPoints }}</p>
        <p>{{ role }}</p>
      </div>
      <img :src="require(`@/assets/characters/${role}.png`)" alt="Player" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class Player extends Vue {
  @Prop() private role: string;
  @Prop() private ready: boolean;
  @Prop() private victoryPoints: number;
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/Player.scss';
</style>
