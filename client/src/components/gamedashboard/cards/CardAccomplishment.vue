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
        <p v-for="investment in total" :key="investment + Math.random()">
          <!-- Note: will need to adjust key -->
          <img :src="require(`@/assets/investmentsIcons/${investment}.png`)" alt="Player" />
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
  }) private accomplishment: object;

  costs = ['upkeep', 'finance', 'legacy', 'government', 'culture', 'science'];

  total = [];

  imageScale = '';

  mounted() {
    this.$root.$on('udpateAccomplishments', (data: any) => {
      this.total = this.costs
        .map((curr) => {
          const cost = Math.abs(this.accomplishment[[curr]]);
          const amount = [];
          for (let i = 0; i < cost; i += 1) {
            amount.push(curr);
          }
          return amount;
        })
        .reduce((prev, curr) => prev.concat(curr), []);

      this.imageScale = this.total.length > 6 ? 'width:1.5rem' : 'width:2.5rem';
    });
  }

  handleClick() {
    this.$root.$emit('openCard', {
      card: 'accomplishment',
      payload: {
        title: this.accomplishment.label,
        info: this.accomplishment.flavorText,
        total: this.total,
      },
    });
  }
}
</script>

<style scoped>
.card-accomplishment {
  height: auto;
  min-height: 7rem;
  width: 85%;
  margin: 0.5rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  color: var(--space-white);
  overflow: hidden;
  cursor: pointer;
  transition: all .2s ease-in-out;
}

.card-accomplishment:hover {
  transform: scale(1.1);
}

.card-title {
  height: 30%;
  width: 100%;
  padding: 0.5rem;
  margin: 0;
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
  border: var(--border-white);
  border-top: none;
  border-radius: 0 0 1rem 1rem;
  display: flex;
  justify-content: space-between;
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
  flex-grow: 100;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.card-cost p {
  height: 2rem;
  width: 2rem;
  border-radius: 50%;
  margin: 0.125rem;
  background-color: var(--space-white);
}

.card-cost img {
  height: 100%;
  width: 100%;
}
</style>
