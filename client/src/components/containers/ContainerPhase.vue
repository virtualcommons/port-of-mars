<template>
  <BContainer class="container-phase">
  </BContainer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
  },
})

export default class ContainerPhase extends Vue {}
</script>

<style scoped>
.container-phase {
  width: 100%;
  height: 80%;
  padding: 0;
  background-color: pink;
}
</style>
