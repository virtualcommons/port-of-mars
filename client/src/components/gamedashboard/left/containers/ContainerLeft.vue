<template>
  <div class="container-left">
    <ContainerProfile />
    <ProfileInvestments />
    <ContainerAccomplishments />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ContainerProfile from '@port-of-mars/client/components/gamedashboard/left/containers/ContainerProfile.vue';
import ProfileInvestments from '@port-of-mars/client/components/gamedashboard/left/ProfileInvestments.vue';
import ContainerAccomplishments from '@port-of-mars/client/components/gamedashboard/left/containers/ContainerAccomplishments.vue';

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
@import '@port-of-mars/client/stylesheets/gamedashboard/left/containers/ContainerLeft.scss';
</style>
