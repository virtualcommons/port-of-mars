<template>
  <BContainer class="container-investments">
    <BRow class="investments-topbar">
      <p class="investments-topbar-title">Investments</p>
      <StatusBar
        class="investments-topbar-statusbar"
        :setWidth="`${timeblockStatus * 10}`"
        :colorOuter="'statusbar-outer-gray'"
        :colorInner="'statusbar-inner-gray'"
      />
      <p class="investments-topbar-status">( {{ timeblockStatus }} )</p>
    </BRow>

    <BRow class="investments-cards">
      <BRow class="investments-cards-top">
        <CardInvestment :investmentData="investmentData.upkeep"/>
        <CardInvestment :investmentData="investmentData.finance"/>
        <CardInvestment :investmentData="investmentData.legacy"/>
      </BRow>

      <BRow class="investments-cards-bottom">
        <CardInvestment :investmentData="investmentData.government"/>
        <CardInvestment :investmentData="investmentData.culture"/>
        <CardInvestment :investmentData="investmentData.science"/>
      </BRow>
    </BRow>
  </BContainer>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';
import StatusBar from '@/components/StatusBar.vue';
import CardInvestment from '@/components/CardInvestment.vue';
import Asset from '@/components/Asset.vue';

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
    StatusBar,
    CardInvestment,
    Asset,
  },
})
export default class ContainerInvestments extends Vue {
  private timeblockStatus: number = 10;

  private investmentData: object = this.$store.state.localInvestments.returnValues;

  updated() {
    console.log(this.timeblockStatus);
    // let decrement: number = 0;
    // for(let investment in this.investmentData) {
    //   decrement += (this.investmentData[investment].currentCost *
    // this.investmentData[investment].currentInventory)
    // }
    // this.timeblockStatus -= decrement;
    // console.log(this.timeblockStatus)
  }
}
</script>

<style scoped>
.container-investments {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.investments-topbar {
  height: 10%;
  margin: 0;
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 0.125rem solid #f5f5f5;
  border-right: 0.125rem solid #f5f5f5;
  background-color: #c67b5c;
}

.investments-topbar-title {
  margin: 0;
  color: #1e2223;
  font-size: 1.5rem;
}

.investments-topbar-statusbar {
  margin: 0 1rem;
}

.investments-topbar-status {
  margin: 0;
  color: #1e2223;
  font-size: 1.5rem;
}

.investments-cards {
  height: 90%;
  margin: 0;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  border-right: 0.125rem solid #f5f5f5;
}

.investments-cards-top {
  height: 50%;
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

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
