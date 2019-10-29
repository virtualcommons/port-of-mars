<template>
  <div class="card-investment">
    <div class="investment-options">
      <div class="card-type">
        <div class="card-type-img">
          <i class="fas fa-spinner fa-2x"></i>
        </div>
        <div class="card-type-cost">
          <p>{{ investmentData.currentCost }}</p>
        </div>
      </div>
      <div class="card-increment-and-decrement-holder">
        <div class="investment-increment" @click="incrementInvestment">
          <p>+</p>
        </div>
        <div class="investment-decrement" @click="decrementInvestment">
          <p>-</p>
        </div>
      </div>
    </div>
    <div class="investment-amount">
      <p>{{ `${investmentData.n} - ${investmentData.currentInventory}` }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { InvestmentProperties } from '@/models/index';
@Component({})
export default class CardInvestment extends Vue {
  @Prop(InvestmentProperties) private investmentData!: InvestmentProperties;

  incrementInvestment() {
    if (
      this.$store.state.localInvestments.localDecrement - this.investmentData.currentCost >= 0
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
.investment-amount {
  margin-top: 0.5rem;
  color: white;
  text-align: center;
}

.investment-amount p {
  text-transform: capitalize;
}

.investment-options {
  height: 7rem;
  width: 9.5rem;
  border: 0.125rem solid #f5f5f5;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  text-align: center;
  overflow: hidden;
  color: white;
}

.card-type {
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
  border-left: 0.125rem solid #f5f5f5;

  display: flex;
  flex-direction: column;
}

.investment-increment {
  height: 50%;
  width: 100%;
  border-bottom: 0.0625rem solid #F5F5F5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.investment-increment p {
  font-size: 1.5rem;
  margin: 0;
}

.investment-decrement {
  height: 50%;
  width: 100%;
  border-top: 0.0625rem solid #F5F5F5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.investment-decrement p {
  font-size: 1.5rem;
  margin: 0;
}

.investment-increment:hover {
  background-color: #c67b5c;
  cursor: pointer;
}
.investment-decrement:hover {
  background-color: #c67b5c;
  cursor: pointer;
}
</style>
