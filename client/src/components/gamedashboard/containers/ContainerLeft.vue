<template>
  <div class="container-left">
    <Round />
    <ContainerProfile />
    <MarsLog />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Round from '@/components/gamedashboard/Round.vue';
import ContainerProfile from '@/components/gamedashboard/containers/ContainerProfile.vue';
import MarsLog from '@/components/gamedashboard/MarsLog.vue';

@Component({
  components: {
    Round,
    ContainerProfile,
    MarsLog
  }
})
export default class ContainerLeft extends Vue {}
</script>

<style scoped>
.container-left {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
</style>
