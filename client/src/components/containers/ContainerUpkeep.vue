<template>
  <BContainer class="container-upkeep">
    <StatusBar class="upkeep-statusbar"/>
    <p>Upkeep <span class="upkeep-status">90</span>/100</p>
  </BContainer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';
import StatusBar from '@/components/StatusBar.vue';

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
    StatusBar,
  },
})

export default class ContainerUpkeep extends Vue {}
</script>

<style scoped>
.container-upkeep {
  width: 80%;
  height: 20%;
  padding: 0;
  /* background-color: green; */
  color: #F5F5F5;
}

.container-upkeep p {
  width: 100%;
  text-align: center;
  margin: 0.5rem 0 0 0;
  font-size: 1.25rem;
}

.upkeep-statusbar {
  width: 100%;
  margin-top: 1rem;
}

.upkeep-status {
  color: #C67B5C;
}
</style>
