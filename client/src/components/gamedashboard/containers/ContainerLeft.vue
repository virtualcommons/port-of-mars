<template>
  <div class="container-left">
    <Round />
    
    <ContainerProfile />
    <ProfileInvestments class="v-step-15" />
    <MarsLog class="v-step-7" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Round from '@/components/gamedashboard/Round.vue';
import ContainerProfile from '@/components/gamedashboard/containers/ContainerProfile.vue';
import ProfileInvestments from '@/components/gamedashboard/ProfileInvestments.vue';
import MarsLog from '@/components/gamedashboard/MarsLog.vue';
import Notification from "@/components/gamedashboard/Notification.vue";

@Component({
  components: {
    Round,
    ContainerProfile,
    ProfileInvestments,
    MarsLog,
    Notification,
  }
})
export default class ContainerLeft extends Vue {
  // get notifications(){
  //   console.log(this.$store.state.activeNotifications);
  //   return this.$store.state.activeNotifications;
  // }
}
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
