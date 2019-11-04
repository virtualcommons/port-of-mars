<template>
  <div class="container-left">
    <ProfileModal />
    <div class="placeholder-left">
      <!-- will eventually refactor -->
      <Round id="v-step-3"/>
      <Notification id="v-step-4"/>
      <ContainerProfile :playerRole='this.$store.state.playerRole' :playerScore="10"/>
    </div>
    <MarsLog id="v-step-5"/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Round from '@/components/gamedashboard/Round.vue';
import Notification from '@/components/gamedashboard/Notification.vue';
import ContainerProfile from '@/components/gamedashboard/containers/ContainerProfile.vue';
import MarsLog from '@/components/gamedashboard/MarsLog.vue';
import ProfileModal from '@/components/gamedashboard/ProfileModal.vue';

@Component({
  components: {
    Round,
    Notification,
    ContainerProfile,
    MarsLog,
    ProfileModal,
  },
})
export default class ContainerLeft extends Vue {}
</script>

<style scoped>
.container-left {
  height: 100vh;
  width: 100%;
  padding: 1rem 0rem 1rem 1rem;
}

.placeholder-left {
  height: 50%;
  display: flex;
  flex-direction: column;
}
</style>
