<template>
  <BContainer class="container-trading">
    <BRow>
      <BCol cols="6">
        <BRow>
          <p>Incoming Trades</p>
        </BRow>
        <BRow>
          <Trade/>
          <Trade/>
        </BRow>
      </BCol>

      <BCol cols="6">
        <BRow>
          <p>Build-a-trade workshop</p>
        </BRow>
      </BCol>
    </BRow>
  </BContainer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';

import Trade from "../Trade.vue"; 

@Component({
    components: {
      Trade,
    }
})
export default class ContainerTrading extends Vue{}

</script>

<style scoped>
.container-trading {
  height: 100%;
  width: 100%;
  max-width: none;
  color: var(--space-white);
  /* border: 0.125rem solid var(--space-white-opaque-2); */
}

</style>