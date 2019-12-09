<template>
  <div class="card-investment-container">
    <div class="card-investment">
      <div class="card-investment-type">
        <p class="card-investment-type-name">{{ name }}</p>
        <div class="card-investment-type-img">
          <img :src="require(`@/assets/iconsSVG/${name}.svg`)" alt="Player" />
        </div>
        <div class="card-investment-type-data">
          <div class="card-investment-type-data-cost">
            <p>
              {{ cost <= 1000 ? cost : 'X' }}
            </p>
          </div>
        </div>
      </div>
      <div class="card-investment-increment-decrement" v-if="!disabled">
        <button
          class="card-investment-increment"
          type="button"
          name="button"
          @click="setInvestmentAmount(1)"
        >
          +
        </button>
        <button
          class="card-investment-decrement"
          type="button"
          name="button"
          @click="setInvestmentAmount(-1)"
        >
          -
        </button>
      </div>
      <div class="card-investment-increment-decrement-disabled" v-if="disabled"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Inject } from 'vue-property-decorator';
import {Phase, Resource, Role} from "shared/types";
import { RequestAPI } from '@/api/request';

@Component({})
export default class CardInvestment extends Vue {

  @Inject()
  $api!: RequestAPI;

  // @Prop() private investmentData!: InvestmentProperties;

  @Prop() private name!: Resource;
  @Prop() private cost!: number;
  @Prop() private pendingInvestment!: number;

  get disabled() {
    return this.cost === -1;
  }

  setInvestmentAmount(diff: number) {
    this.$emit('input', {name: this.name, units: this.pendingInvestment + diff, cost: this.cost});
  }
}
</script>
,
<style scoped>
.card-investment-container {
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.card-investment {
  height: 9.5rem;
  width: 100%;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  text-align: center;
  color: var(--space-gray);
  overflow: hidden;
}

.card-investment-type {
  height: 100%;
  width: 70%;
  padding: 0.5rem;
  border: var(--border-white);
  border-radius: 1rem 0 0 1rem;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: var(--space-white);
}

.card-investment-type-name {
  margin: 0;
  font-size: var(--font-small);
  text-transform: capitalize;
}

.card-investment-type-img img {
  height: 4.5rem;
  width: 4.5rem;
}

.card-investment-type-data {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.card-investment-type-data-cost {
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--space-gray);
}

.card-investment-type-data-cost p {
  margin: 0;
  font-size: var(--font-small);
  text-align: center;
  color: var(--space-white);
}

.card-investment-increment-decrement {
  height: 100%;
  width: 30%;
  display: flex;
  flex-direction: column;
  background-color: var(--space-gray);
}

.card-investment-increment-decrement-disabled {
  height: 100%;
  width: 30%;
  border: var(--border-white);
  border-left: none;
  border-radius: 0 1rem 1rem 0;
  background-color: var(--space-gray);
}

.card-investment-increment {
  height: 50%;
  width: 100%;
  border: var(--border-white);
  border-left: none;
  border-bottom: none;
  border-radius: 0 1rem 0 0;
  font-size: var(--font-large);
  color: var(--space-white);
  background: transparent;
  transition: all 0.2s ease-in-out;
}

.card-investment-decrement {
  height: 50%;
  width: 100%;
  border: var(--border-white);
  border-radius: 0 0 1rem 0;
  border-top: none;
  border-left: none;
  font-size: var(--font-large);
  color: var(--space-white);
  background: transparent;
  transition: all 0.2s ease-in-out;
}

.card-investment-increment:focus,
.card-investment-increment:active,
.card-investment-decrement:focus,
.card-investment-decrement:active {
  outline: none;
}

.card-investment-increment:hover,
.card-investment-decrement:hover {
  color: var(--space-gray);
  background-color: var(--space-orange);
  cursor: pointer;
  /* transform: scale(1.125); */
}
</style>
