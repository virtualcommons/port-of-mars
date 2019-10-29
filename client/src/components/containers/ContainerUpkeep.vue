<template>
  <BContainer class="container-upkeep" id="v-step-0">
    <StatusBar class="upkeep-statusbar" :setWidth="`${upkeepStatus}`" />
    <p>
      Upkeep <span class="upkeep-status">{{ upkeepStatus }}</span
      >/100
    </p>
  </BContainer>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
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
export default class ContainerUpkeep extends Vue {
  @Prop({ default: 30 }) private upkeepStatus!: number;
}
</script>

<style scoped>
.container-upkeep {
  width: 80%;
  height: 20%;
  padding: 0;
  /* background-color: green; */
  color: #f5f5f5;
}

.container-upkeep p {
  width: 100%;
  text-align: center;
  margin: 0.5rem 0 0 0;
  font-size: 1.25rem;
}

.upkeep-statusbar {
  width: 100%;
  /* margin-top: 1rem; */
}

.upkeep-status {
  color: #c67b5c;
}
</style>
