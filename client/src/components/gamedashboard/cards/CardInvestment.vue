<template>
  <div class="card-investment" :style="opacityModifier">
    <div class="investment-options">
      <div class="card-type">
        <div class="card-type-img">
          <!--<i class="fas fa-spinner fa-2x"></i>-->
          <img :src="require(`@/assets/investmentsIcons/${this.investmentData.n}.png`)"
            alt="Player"/>
        </div>
        <div class="card-type-cost" id="v-step-12">
          <p>{{ investmentData.currentCost }}</p>
        </div>
      </div>
      <div class="card-increment-and-decrement-holder" id="v-step-13">
        <div class="investment-increment" @click="incrementInvestment">
          <p>+</p>
        </div>
        <div class="investment-decrement" @click="decrementInvestment">
          <p>-</p>
        </div>
      </div>
    </div>
    <div class="investment-data">
      <p class="investment-data-name">{{ `${investmentData.n}` }}</p>
      <p class="investment-data-inventory">
        <span>(</span> {{ `${investmentData.currentInventory}` }} <span>)</span>
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

  incrementInvestment() {
    if (
      this.$store.state.gamePhase === 'Time Blocks'
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
@media (max-width: 1680px) {
  .investment-options {
    height: 6.5rem !important;
  }
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
  color: #1e2223;
}

.card-type {
  background-color: #f5f5f5;
  border: 0.125rem solid #f5f5f5;
  border-radius: 1rem 0 0 1rem;
  padding: 0.5rem;
  height: 100%;
  width: 70%;
}

.card-type-img {
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}

.card-type-img i {
  /* height: 50%; */
}

.card-type-cost {
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
  /* border-left: 0.125rem solid #f5f5f5; */

  display: flex;
  flex-direction: column;
}

.investment-increment {
  height: 50%;
  width: 100%;
  /* border-bottom: 0.0625rem solid #f5f5f5; */
  border: 0.125rem solid #f5f5f5;
  /* border: 0.125rem solid pink; */
  border-radius: 0 1rem 0 0;
  border-left: none;
  border-bottom: none;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #f5f5f5;
}

.investment-increment p {
  font-size: 1.5rem;
  margin: 0;
}

.investment-decrement {
  height: 50%;
  width: 100%;
  border: 0.125rem solid #f5f5f5;
  border-radius: 0 0 1rem 0;
  border-left: none;
  border-top: none;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #f5f5f5;
}

.investment-decrement p {
  font-size: 1.5rem;
  margin: 0;
}

.investment-increment:hover {
  color: #1e2223;
  background-color: #c67b5c;
  cursor: pointer;
}
.investment-decrement:hover {
  color: #1e2223;
  background-color: #c67b5c;
  cursor: pointer;
}

.investment-data {
  margin-top: 0.5rem;
  color: white;
  /* text-align: center; */
  display: flex;
  justify-content: space-between;
  /* background-color: pink; */
}

.investment-data p {
  margin: 0;
}

.investment-data-name {
  text-transform: capitalize;
}

.investment-data-inventory {
  color: #c67b5c;
}

.investment-data-inventory span {
  color: #f5f5f5;
}
</style>
