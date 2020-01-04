<template>
  <div class="container-left">
    <ContainerProfile />
    <ProfileInvestments />
    <ContainerAccomplishments />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ContainerProfile from '@/components/gamedashboard/left/containers/ContainerProfile.vue';
import ProfileInvestments from '@/components/gamedashboard/left/ProfileInvestments.vue';
import ContainerAccomplishments from '@/components/gamedashboard/left/containers/ContainerAccomplishments.vue';

@Component({
  components: {
    ContainerProfile,
    ProfileInvestments,
    ContainerAccomplishments
  }
})
export default class ContainerLeft extends Vue {}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/left/containers/ContainerLeft.scss';
</style>
