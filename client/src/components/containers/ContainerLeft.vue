<template>
  <div class="container-left">
    <div class="placeholder-left">
      <!-- will eventually refactor -->
      <Round id="v-step-3"/>
      <Notification id="v-step-4"/>
      <Profile :playerRole='this.$store.state.playerRole' />
    </div>
    <MarsLog id="v-step-5"/>
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
.container-left {
  height: 100vh;
  width: 100%;
  padding: 1rem 0rem 1rem 1rem;
}

.placeholder-left {
  display: flex;
  flex-direction: column;
  height: 50%;
  /* background-color: purple; */
}
</style>
