<template>
  <BContainer class="container-upkeep">
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
import StatusBar from '@/components/gamedashboard/StatusBar.vue';

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
    StatusBar,
  },
})
export default class ContainerUpkeep extends Vue {
  get upkeepStatus() {
    return this.$store.state.upkeep;
  }
}
</script>

<style scoped>
.container-upkeep {
  height: 20%;
  width: 100%;
  max-width: none;
  padding: 0 0.5rem 1rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--space-white);
}

.container-upkeep p {
  width: 100%;
  margin: 0.5rem 0 0 0;
  font-size: 1.25rem;
  text-align: center;
}

.upkeep-statusbar {
  width: 80%;
}

.upkeep-status {
  color: var(--space-orange);
}
</style>
