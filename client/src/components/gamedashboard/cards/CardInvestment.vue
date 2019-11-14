<template>
  <div class="card-investment" :style="opacityModifier">
    <div class="investment-options">
      <div class="card-type">
        <div class="card-type-img">
          <img
            src="https://www.onlygfx.com/wp-content/uploads/2017/03/scribble-circle-4.png"
            alt="Player"
          />
          <!-- <img :src="require(`@/assets/investmentsIcons/${this.investmentData.n}.png`)"
            alt="Player"/> -->
        </div>
        <div class="card-type-cost" id="v-step-12">
          <p>{{ investmentData.currentCost !== -1 ? investmentData.currentCost : 'X' }}</p>
        </div>
      </div>
      <div class="card-increment-and-decrement-holder" id="v-step-13" v-if="!disabled">
        <div class="investment-increment" @click="incrementInvestment">
          <p>+</p>
        </div>
        <div class="investment-decrement" @click="decrementInvestment">
          <p>-</p>
        </div>
      </div>
      <div class="card-increment-and-decrement-holder-disabled" v-if="disabled"></div>
    </div>
    <div class="investment-data">
      <p class="investment-data-name">{{ `${investmentData.n}` }}</p>
      <p class="investment-data-inventory">
        <span>(</span> {{
        `${investmentData.persistentInventory+investmentData.currentInventory}`
        }} <span>)</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { InvestmentProperties } from '../../../models/index';
@Component({})
export default class CardInvestment extends Vue {
  @Prop() private investmentData!: InvestmentProperties;

  opacityModifier = this.investmentData.currentCost === -1 ? 'opacity:50%' : '';

  get disabled() {
    return this.investmentData.currentCost === -1;
  }

  incrementInvestment() {
    if (
      this.$store.state.gamePhase === 'Purchase Investments'
      && this.$store.state.localInvestments.localDecrement - this.investmentData.currentCost >= 0
      && this.investmentData.currentCost > 0
    ) {
      this.$store.dispatch('changeLocalInvestment', {
        investmentName: this.investmentData.n,
        investmentAmount: this.investmentData.currentInventory + 1,
      });
    }
  }

  decrementInvestment() {
    if (this.investmentData.currentInventory > 0) {
      this.$store.dispatch('changeLocalInvestment', {
        investmentName: this.investmentData.n,
        investmentAmount: this.investmentData.currentInventory - 1,
      });
    }
  }
}
</script>

<style scoped>
.card-investment {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.investment-options {
  height: 7rem;
  width: 9.5rem;
  /* border: 0.125rem solid pink; */
  border-radius: 1rem;
  display: flex;
  align-items: center;
  text-align: center;
  overflow: hidden;
  color: var(--space-gray);
}

.card-type {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--space-white);
  border: var(--border-white);
  border-radius: 1rem 0 0 1rem;
  padding: 0.5rem;
  height: 100%;
  width: 70%;
}

.card-type-img {
  /* height: 70%; */
  /* background-color: green; */
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  border: 0.125rem solid var(--space-orange);
  border-radius: 50%;
  padding: 0.25rem;
}

.card-type-img img {
  /* border: 0.125rem solid var(--space-orange); */
  height: 3.5rem;
  width: 3.5rem;
}

.card-type-cost {
  position: absolute;
  right: 0.5rem;
  bottom: 0.25rem;
  height: 30%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 0;
}

.card-type-cost p {
  margin: 0;
}

.card-increment-and-decrement-holder {
  width: 30%;
  height: 100%;
  /* border-left: var(--border-white); */

  display: flex;
  flex-direction: column;
}

.card-increment-and-decrement-holder-disabled {
  width: 30%;
  height: 100%;
  /* background-color: green; */
  border: var(--border-white);
  border-radius: 0 1rem 1rem 0;
  border-left: none;
}

.investment-increment {
  height: 50%;
  width: 100%;
  /* border-bottom: 0.0625rem solid var(--space-white); */
  border: var(--border-white);
  /* border: 0.125rem solid pink; */
  border-radius: 0 1rem 0 0;
  border-left: none;
  border-bottom: none;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--space-white);
}

.investment-increment p {
  font-size: var(--font-large);
  margin: 0;
}

.investment-decrement {
  height: 50%;
  width: 100%;
  border: var(--border-white);
  border-radius: 0 0 1rem 0;
  border-left: none;
  border-top: none;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--space-white);
}

.investment-decrement p {
  font-size: var(--font-large);
  margin: 0;
}

.investment-increment:hover {
  color: var(--space-gray);
  background-color: var(--space-orange);
  cursor: pointer;
}
.investment-decrement:hover {
  color: var(--space-gray);
  background-color: var(--space-orange);
  cursor: pointer;
}

.investment-data {
  width: 100%;
  margin-top: 0.5rem;
  color: white;
  /* text-align: center; */
  display: flex;
  justify-content: space-between;
}

.investment-data p {
  margin: 0;
}

.investment-data-name {
  text-transform: capitalize;
}

.investment-data-inventory {
  color: var(--space-orange);
}

.investment-data-inventory span {
  color: var(--space-white);
}
</style>
