<template>
  <div class="member-score" :style="{ 'background-color': `var(--color-${role})` }">
    <p class="member-score-number">{{ victoryPoints }}</p>
    <p>{{ role }}</p>
    <img :src="require(`@/assets/characters/${role}.png`)" alt="Player" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class Member extends Vue {
  @Prop() private role: string;
  @Prop() private victoryPoints: number;
}
</script>

<style scoped>
.member-score {
  height: 3rem;
  width: 100%;
  padding: 0.25rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* background-color: green; */
}

.member-score:last-child {
  margin-bottom: 0;
}

.member-score p {
  margin-bottom: 0;
  text-align: center;
  text-overflow: ellipsis;
  color: var(--space-white);
  white-space: nowrap;
  overflow: hidden;
}

.member-score img {
  height: 100%;
}

.member-score-number {
  margin-left: 0.5rem;
}
</style>
