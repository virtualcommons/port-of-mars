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
          <img :src="require(`@/assets/investmentsIcons/${investment}.png`)" alt="Player"
            :style="imageScale"/>
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
      };
    },
  }) private accomplishment;

  imageScale = '';

  

  handleClick() {
    this.$root.$emit('openCard', {
      card: 'accomplishment',
      payload: {
        title: this.accomplishment.label,
        info: this.accomplishment.flavorText,
        total: this.accomplishment.totalCostArray,
        bought: this.accomplishment.bought,
      },
    });
  }
}
</script>

<style scoped>
.card-accomplishment {
  height: auto;
  min-height: 7rem;
  width: 80%;
  margin: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  color: var(--space-white);
  overflow: hidden;
  cursor: pointer;
  transition: all .2s ease-in-out;
  /* background-color: blue; */
}

.card-accomplishment:hover {
  transform: scale(1.1);
}

.card-title {
  height: 30%;
  width: 100%;
  padding: 0.5rem;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--space-white);
  border-radius: 1rem 1rem 0 0;
  color: var(--space-gray);
  /* background-color: pink; */
}

.card-title p {
  margin: 0;
  text-transform: capitalize;
  text-align: center;
}

.card-info-container {
  height: 70%;
  width: 100%;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  border-left: var(--border-white);
  border-right: var(--border-white);
  border-bottom: var(--border-white);
  border-radius: 0 0 1rem 1rem;
  /* background-color: green; */
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
  flex-grow: 100;
}

.card-cost p {
  margin: 0;
}

.card-cost img {
  margin: 0.125rem;
  height: 2rem;
  width: 2rem;
}
</style>
