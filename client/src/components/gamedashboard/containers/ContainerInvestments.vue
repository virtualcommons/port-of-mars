<template>
  <BContainer class="container-investments">
    <BRow class="investments-topbar v-step-10">
      <p class="investments-topbar-title">Time Investments</p>
      <StatusBar
        class="investments-topbar-statusbar"
        :setWidth="`${decrementInvestmentCount * 10}`"
        :colorOuter="'statusbar-outer-gray'"
        :colorInner="'statusbar-inner-gray'"
      />
      <p class="investments-topbar-status">( {{ decrementInvestmentCount }} )</p>
    </BRow>

    <BRow class="investments-cards v-step-11 v-step-12">
      <BRow class="investments-cards-top">
        <CardInvestment :investmentData="costs[2]" class="v-step-13" />
        <CardInvestment :investmentData="costs[3]" />
        <CardInvestment :investmentData="costs[0]" />
      </BRow>

      <BRow class="investments-cards-bottom">
        <CardInvestment :investmentData="costs[4]" />
        <CardInvestment :investmentData="costs[5]" />
        <CardInvestment :investmentData="costs[1]" />
      </BRow>
    </BRow>
  </BContainer>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';
import StatusBar from '@/components/gamedashboard/StatusBar.vue';
import CardInvestment from '@/components/gamedashboard/cards/CardInvestment.vue';

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
    StatusBar,
    CardInvestment
  }
})
export default class ContainerInvestments extends Vue {
  get costs(): any {
    const rv = this.$store.state.localInvestments.returnValues;
    const costData = Object.keys(rv)
      .reduce((prev, curr) => {
        prev.push(rv[curr]);
        return prev;
      }, [])
      .sort((a, b) => a.currentCost - b.currentCost);
    return costData;
  }

  get decrementInvestmentCount() {
    return this.$store.state.localInvestments.localDecrement;
  }
}
</script>

<style scoped>
.container-investments {
  height: 100%;
  width: 100%;
  max-width: none;
  padding: 0.5rem;
  padding-right: 0.25rem;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.investments-topbar {
  height: 10%;
  width: 100%;
  margin: 0;
  margin-bottom: 0.5rem;
  padding: 0.25rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--space-orange);
}

.investments-topbar-title {
  margin: 0;
  font-size: var(--font-med);
  color: var(--space-gray);
}

.investments-topbar-statusbar {
  margin: 0 1rem;
  flex: 1;
}

.investments-topbar-status {
  margin: 0;
  font-size: var(--font-med);
  color: var(--space-gray);
}

.investments-cards {
  height: 90%;
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  background-color: var(--space-white-opaque-1);
}

.investments-cards-top,
.investments-cards-bottom {
  height: 50%;
  width: 100%;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  /* background-color: var(--space-white-opaque-1); */
}
</style>
