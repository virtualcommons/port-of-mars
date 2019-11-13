<template>
  <BContainer class="container-investments">
    <BRow class="investments-topbar">
      <p class="investments-topbar-title">Investments</p>
      <StatusBar
        class="investments-topbar-statusbar"
        :setWidth="`${decrementInvestmentCount* 10}`"
        :colorOuter="'statusbar-outer-gray'"
        :colorInner="'statusbar-inner-gray'"
         id="v-step-10"
      />
      <p class="investments-topbar-status">
        ( {{ decrementInvestmentCount }} )
      </p>
    </BRow>

    <BRow class="investments-cards">
      <BRow class="investments-cards-top">
        <CardInvestment :investmentData="iD[[i[2]]]" id="v-step-11" />
        <CardInvestment :investmentData="iD[[i[3]]]" />
        <CardInvestment :investmentData="iD[[i[0]]]" />
      </BRow>

      <BRow class="investments-cards-bottom">
        <CardInvestment :investmentData="iD[[i[4]]]" id="v-step-14" />
        <CardInvestment :investmentData="iD[[i[5]]]" />
        <CardInvestment :investmentData="iD[[i[1]]]" />
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
    CardInvestment,
  },
})
export default class ContainerInvestments extends Vue {
  private iD: object = this.$store.state.localInvestments.returnValues;

  private availiableInvestments = [];


  // private investmentsInOrder = Object.keys(this.iD).sort(function (a, b) {
  //   return this.iD[a].currentCost - this.iD[b].currentCost;
  // });

  i = Object.keys(this.iD).sort((a, b) => this.iD[a].currentCost - this.iD[b].currentCost)

  // console.log(temp);


  get decrementInvestmentCount() {
    return this.$store.state.localInvestments.localDecrement;
  }

  // updated() {
  //   console.log(this.timeblockStatus);
  //   let decrement: number = 0;
  //   for(let investment in this.iD) {
  //     decrement += (this.iD[investment].currentCost *
  //   this.iD[investment].currentInventory)
  //   }
  //   this.timeblockStatus -= decrement;
  //   console.log(this.timeblockStatus)
  // }
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
  padding: 0.25rem 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 0.125rem solid var(--space-white);
  border-right: 0.125rem solid var(--space-white);
  background-color: var(--space-orange);
}

.investments-topbar-title {
  margin: 0;
  color: var(--space-gray);
  font-size: 1.5rem;
}

.investments-topbar-statusbar {
  margin: 0 1rem;
}

.investments-topbar-status {
  margin: 0;
  color: var(--space-gray);
  font-size: 1.5rem;
}

.investments-cards {
  height: 90%;
  margin: 0;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  border-right: 0.125rem solid var(--space-white);
}

.investments-cards-top, .investments-cards-bottom {
  height: 50%;
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
