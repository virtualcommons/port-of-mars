<template>
  <BContainer class="container-phase">
    <BRow class="row-phase">
      <BCol class="phase" cols="4">
        <!-- phase component -->
        <Phase />
      </BCol>
      <BCol class="events" cols="8">
        <!-- event card components (3) -->
      </BCol>
    </BRow>
  </BContainer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';
import Phase from '@/components/Phase.vue';

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
    Phase,
  },
})

export default class ContainerPhase extends Vue {}
</script>

<style scoped>
.container-phase {
  width: 100%;
  height: 80%;
  padding: 0;
  /* background-color: pink; */
}

.row-phase {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

.phase {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  /* background-color: purple; */
}

.events {
  padding: 0;
  background-color: orange;
}
</style>
