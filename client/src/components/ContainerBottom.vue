<template>
    <div class="container-bottom">
        <ContainerInvestments/>
        <ContainerAccomplishments/>
    </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import ContainerInvestments from '@/components/ContainerInvestments.vue';
  import ContainerAccomplishments from '@/components/ContainerAccomplishments.vue';

    @Component({
      components: {
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
        /* padding: 1rem; */
        /* border: 0.25rem solid black; */
        border: 0.125rem solid #F5F5F5;
        flex-direction: column;
    }
</style>
