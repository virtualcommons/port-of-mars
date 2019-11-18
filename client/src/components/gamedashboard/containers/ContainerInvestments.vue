<template>
  <BContainer class="container-investments">
    <BRow class="investments-topbar">
      <p class="investments-topbar-title">Investments</p>
      <StatusBar
        class="investments-topbar-statusbar"
        :setWidth="`${decrementInvestmentCount * 10}`"
        :colorOuter="'statusbar-outer-gray'"
        :colorInner="'statusbar-inner-gray'"
        id="v-step-10"
      />
      <p class="investments-topbar-status">( {{ decrementInvestmentCount }} )</p>
    </BRow>

    <BRow class="investments-cards">
      <BRow class="investments-cards-top">
        <CardInvestment :investmentData="iD[2]" id="v-step-11" />
        <CardInvestment :investmentData="iD[3]" />
        <CardInvestment :investmentData="iD[0]" />
      </BRow>

      <BRow class="investments-cards-bottom">
        <CardInvestment :investmentData="iD[4]" id="v-step-14" />
        <CardInvestment :investmentData="iD[5]" />
        <CardInvestment :investmentData="iD[1]" />
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
  // REFACTOR TO GETTERS
  get iD(): any {
    const rv = this.$store.state.localInvestments.returnValues; // eslint-disable-line no-use-before-define
    // console.log(rv); // eslint-disable-line no-use-before-define
    // console.log(returnValues); // eslint-disable-line no-use-before-define
    // const sorted = Object.keys(rv).sort(
    //   (a, b) => rv[a].currentCost - rv[b].currentCost
    // );
    const costData = Object.keys(rv).reduce((prev, curr) => {
      prev.push(rv[curr]);
      return prev;
    }, []).sort((a,b) => a.currentCost - b.currentCost);

    // console.log(costData); // eslint-disable-line no-use-before-define
    return costData;
  }


  // private iD: object = this.$store.state.localInvestments.returnValues;

  // i = Object.keys(this.iD).sort((a, b) => this.iD[a].currentCost - this.iD[b].currentCost);

  get decrementInvestmentCount() {
    return this.$store.state.localInvestments.localDecrement;
  }
}
</script>

<style scoped>
.container-investments {
  width: 100%;
  max-width: none;
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.investments-topbar {
  height: 10%;
  width: 100%;
  margin: 0;
  padding: 0.25rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: var(--border-white);
  border-right: var(--border-white);
  background-color: var(--space-orange);
}

.investments-topbar-title {
  margin: 0;
  color: var(--space-gray);
  font-size: var(--font-large);
}

.investments-topbar-statusbar {
  flex: 1;
  margin: 0 1rem;
}

.investments-topbar-status {
  margin: 0;
  color: var(--space-gray);
  font-size: var(--font-large);
}

.investments-cards {
  height: 90%;
  margin: 0;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  border-right: var(--border-white);
}

.investments-cards-top,
.investments-cards-bottom {
  height: 50%;
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
