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
        label: 'pregame status',
        victoryPoints: '-',
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
  min-height: 7rem;
  width: 80%;
  display: flex;
  flex-direction: column;
  text-align: center;
  color: var(--space-white);
  overflow: hidden;
  cursor: pointer;
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
}

.card-title p {
  margin: 0;
  text-align: center;
}

.card-info-container {
  height: 70%;
  width: 100%;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  border-left: 0.125rem solid var(--space-white);
  border-right: 0.125rem solid var(--space-white);
  border-bottom: 0.125rem solid var(--space-white);
  border-radius: 0 0 1rem 1rem;
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
  height: 1.25rem;
  width: 1.25rem;
}
</style>
