<template>
  <BContainer class="container-bottom" id="v-step-9">
    <BRow class="row-bottom">
      <BCol class="container-bottom-investments" cols="8">
        <ContainerInvestments />
      </BCol>
      <BCol class="container-bottom-accomplishments" cols="4">
        <ContainerAccomplishments />
      </BCol>
    </BRow>
  </BContainer >
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';
import ContainerInvestments from '@/components/containers/ContainerInvestments.vue';
import ContainerAccomplishments from '@/components/containers/ContainerAccomplishments.vue';

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
        margin: 0;
        padding: 0;
        border: 0.125rem solid #F5F5F5;
    }

    .row-bottom {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
    }

    .container-bottom-investments {
      margin: 0;
      padding: 0;
    }

    .container-bottom-accomplishments {
      margin: 0;
      padding: 0;
    }
</style>
