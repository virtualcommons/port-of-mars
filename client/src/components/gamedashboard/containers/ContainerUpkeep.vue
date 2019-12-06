<template>
  <BContainer class="container-upkeep v-step-0 v-step-1">
    <StatusBar class="upkeep-statusbar" :setWidth="`${upkeepStatus}`" />
    <div class="upkeep-statusbar-text">
      <p>Upkeep</p>
      <p >
        <span class="upkeep-status">( </span>{{ upkeepStatus }}
        <span class="upkeep-status">/</span> 100
        <span class="upkeep-status"> )</span>
      </p>
    </div>
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
    return this.$tstore.state.upkeep;
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

.upkeep-statusbar {
  width: 80%;
}

.upkeep-statusbar-text {
  width: 80%;
  margin-top: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.upkeep-statusbar-text p {
  margin: 0 0.25rem;
  font-size: var(--font-med);
  text-align: center;
}

.upkeep-statusbar-text span {
  color: var(--space-orange);
}
</style>
