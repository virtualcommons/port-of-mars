<template>
  <BContainer class="container-bottom" id="v-step-9">
    <BRow class="row-bottom">
      <BCol class="container-bottom-investments" cols="7">
        <ContainerInvestments />
      </BCol>
      <BCol class="container-bottom-accomplishments" cols="5">
        <ContainerAccomplishments />
      </BCol>
    </BRow>
  </BContainer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';
import ContainerInvestments from '@/components/gamedashboard/containers/ContainerInvestments.vue';
import ContainerAccomplishments from '@/components/gamedashboard/containers/ContainerAccomplishments.vue';

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
    ContainerInvestments,
    ContainerAccomplishments,
  },
})
export default class ContainerBottom extends Vue {}
</script>

<style scoped>
.container-bottom {
  height: 100%;
  width: 100%;
  padding: 0 1rem;
  margin: 0;
  max-width: none;
}

.row-bottom {
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
  border: var(--border-white);
}

.container-bottom-investments, .container-bottom-accomplishments {
  height: 100%;
  padding: 0;
  margin: 0;
}
</style>
