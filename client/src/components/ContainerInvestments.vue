<template>
  <BContainer class="container-investments">
    <BRow class="row-investments">
      <BCol class="investments" cols="7">
        <BRow class="row-investments-title">
          <p>Investments</p>
        </BRow>
        <BRow class="row-investments-cards">
          <CardInvestment/>
          <CardInvestment/>
          <CardInvestment/>
        </BRow>
        <BRow class="row-investments-cards">
          <CardInvestment/>
          <CardInvestment/>
          <CardInvestment/>
        </BRow>
      </BCol>
      <BCol class="assets" cols="5">
        <BRow class="row-assets-title">
          <p>Assets</p>
        </BRow>
        <BRow class="row-assets-list">
          <p>Assets List</p>
        </BRow>
      </BCol>
    </BRow>
  </BContainer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';
import CardInvestment from '@/components/CardInvestment.vue';

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
    CardInvestment,
  },
})

export default class ContainerInvestments extends Vue {};
</script>

<style scoped>
.container-investments {
  width: 100%;
  height: 60%;
  padding: 0;
  /* border: 0.25rem solid #F5F5F5; */
  color: #F5F5F5;
  /* margin: 0 !important; */
}

.row-investments {
  height: 100%;
  width: 100%;
  margin: 0;
}

.investments {
  background-color: blue;
  padding: 1rem;
  width: 100%;
}

.row-investments-title {
  margin: 0;
  height: 20%;
  align-items: center;
}

.row-investments-title p {
  font-size: 1.5rem;
  margin: 0;
}

.row-investments-cards {
  width: 100%;
  height: 40%;
  margin: 0;
  justify-content: space-between;
  align-items: center;
}

.assets {
  background-color: green;
  padding: 1rem;
  width: 100%;

}

.row-assets-title {
  /* margin: 0; */
  align-items: center;
  width: 100%;
  height: 20%;
  margin: 0;
}

.row-assets-title p {
  font-size: 1.5rem;
  margin: 0;
}

.row-assets-list {
  width: 100%;
  height: 80%;
  margin: 0;
}
</style>
