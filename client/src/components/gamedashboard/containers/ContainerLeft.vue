<template>
  <div class="container-left">
    <Round />

    <ContainerProfile />
    <ProfileInvestments class="v-step-15" />
    <ContainerAccomplishments />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Round from '@/components/gamedashboard/Round.vue';
import ContainerProfile from '@/components/gamedashboard/containers/ContainerProfile.vue';
import ProfileInvestments from '@/components/gamedashboard/ProfileInvestments.vue';
import ContainerAccomplishments from '@/components/gamedashboard/containers/ContainerAccomplishments.vue';

@Component({
  components: {
    Round,
    ContainerProfile,
    ProfileInvestments,
    ContainerAccomplishments
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
