<template>
  <div class="card-investment">
    <div class="investment-options" :style="opacityModifier">
      <div class="card-type">
        <div class="card-type-img">
          <!-- <img
            src="https://www.onlygfx.com/wp-content/uploads/2017/03/scribble-circle-4.png"
            alt="Player"
          /> -->
          <img :src="require(`@/assets/iconsSVG/${this.investmentData.n}.svg`)"
            style="width:5rem; height:5rem" alt="Player"/>
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
      <p class="investment-data-inventory" :style="style">
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
  
  get style(){
    if(this.investmentData.persistentInventory < this.investmentData.persistentInventory+this.investmentData.currentInventory){
      return 'color:#90ee90';
    }
    return '';
  }

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
  border-radius: 1rem;
  display: flex;
  align-items: center;
  text-align: center;
  color: var(--space-gray);
  overflow: hidden;
}

.card-type {
  height: 100%;
  width: 70%;
  padding: 0.5rem;
  border: var(--border-white);
  border-radius: 1rem 0 0 1rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--space-white);
}

/* .card-type-img {
  padding: 0.25rem;
  margin: 0;
  border: 0.125rem solid var(--space-orange);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
} */

.card-type-img img {
  height: 3.5rem;
  width: 3.5rem;
}

.card-type-cost {
  height: 30%;
  margin: 0;
  position: absolute;
  right: 0.5rem;
  bottom: 0.25rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.card-type-cost p {
  margin: 0;
}

.card-increment-and-decrement-holder {
  height: 100%;
  width: 30%;
  display: flex;
  flex-direction: column;
  /* transition: all .2s ease-in-out; */
}

.card-increment-and-decrement-holder-disabled {
  height: 100%;
  width: 30%;
  border: var(--border-white);
  border-left: none;
  border-radius: 0 1rem 1rem 0;
}

.investment-increment {
  height: 50%;
  width: 100%;
  border: var(--border-white);
  /* border: 0.125rem solid var(--space-orange); */
  border-left: none;
  border-bottom: none;
  border-radius: 0 1rem 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--space-white);
  transition: all .2s ease-in-out;
}

.investment-increment p {
  margin: 0;
  font-size: var(--font-large);
}

.investment-decrement {
  height: 50%;
  width: 100%;
  border: var(--border-white);
  /* border: 0.125rem solid var(--space-orange); */
  border-radius: 0 0 1rem 0;
  border-top: none;
  border-left: none;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--space-white);
  transition: all .2s ease-in-out;
}

.investment-decrement p {
  margin: 0;
  font-size: var(--font-large);
}

.investment-increment:hover, .investment-decrement:hover {
  color: var(--space-gray);
  background-color: var(--space-orange);
  cursor: pointer;
  /* transform: scale(1.125); */
}

.investment-data {
  width: 100%;
  margin-top: 0.5rem;
  display: flex;
  justify-content: space-between;
  color: white;
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
