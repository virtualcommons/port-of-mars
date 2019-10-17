<template>
  <div class="container-left">
    <div class="placeholder">
      <!-- will eventually refactor -->
      <!-- round component goes here -->
      <Round />
      <!-- notification component goes here -->
      <Notification />
      <!-- profile component goes here -->
      <Profile />
    </div>
    <MarsLog />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Round from '@/components/Round.vue';
import Notification from '@/components/Notification.vue';
import Profile from '@/components/Profile.vue';
import MarsLog from '@/components/MarsLog.vue';

@Component({
  components: {
    Round,
    Notification,
    Profile,
    MarsLog,
  },
})

export default class ContainerLeft extends Vue {}
</script>

<style scoped>
.placeholder {
  display: flex;
  flex-direction: column;
  height: 50%;
  /* background-color: purple; */
}
.container-left {
  height: 100%;
  width: 100%;
  padding: 1rem 0rem 1rem 1rem;
}
</style>
