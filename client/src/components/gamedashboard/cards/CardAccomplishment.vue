<template>
    <div class="card-accomplishment" @click="handleClick">
      <div class="card-title">
        <p>{{ accomplishment.label }}</p>
      </div>
      <div class="card-info-container">
        <div class="card-points">
          <p>Points</p>
          <p>{{ accomplishment.victoryPoints }}</p>
        </div>
        <div class="card-cost">
          <p v-for="investment in accomplishment.totalCostArray" :key="investment + Math.random()">
            <!-- Note: will need to adjust key -->
            <img :src="require(`@/assets/iconsSVG/${investment}.svg`)" alt="Player" />
          </p>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class CardAccomplishment extends Vue {
  @Prop({
    default() {
      return {
        label: '---',
        victoryPoints: '---',
        flavorText: '---',
        totalCostArray: [],
      };
    },
  })
  private accomplishment;

  handleClick() {
    this.$root.$emit('openCard', {
      card: 'accomplishment',
      payload: this.accomplishment,
    });
  }
}
</script>

<style scoped>

.card-accomplishment {
  height: auto;
  min-height: 7rem;
  width: 80%;
  margin: 0.5rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  color: var(--space-white);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.card-accomplishment:hover {
  transform: scale(1.1);
}

.card-title {
  height: 30%;
  width: 100%;
  padding: 0.25rem 0.5rem;
  margin: 0;
  margin-bottom: 0.5rem;
  border-radius: 1rem 1rem 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--space-gray);
  background-color: var(--space-white);
}

.card-title p {
  margin: 0;
  text-align: center;
  text-transform: capitalize;
}

.card-info-container {
  height: 70%;
  width: 100%;
  padding: 0.5rem;
  /* border: var(--border-white); */
  /* border-top: none; */
  border-radius: 0 0 1rem 1rem;
  display: flex;
  justify-content: space-between;
  /* background-color: var(--space-white-opaque-1); */
  background-color: var(--space-gray);
}

.card-points {
  margin-right: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.card-points p {
  margin: 0;
}

.card-cost {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.card-cost p {
  height: 2.5rem;
  width: 2.5rem;
  margin: 0.125rem;
  padding: 0;
}
</style>
