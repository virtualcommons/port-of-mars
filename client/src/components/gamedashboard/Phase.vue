<template>
  <div class="phase" id="v-step-7">
    <p class="phase-title">{{currentPhase}} Phase</p>
    <p><span class="phase-current">Invest</span>&nbsp;<span class="phase-time">5:00</span></p>
    <!-- phase-current will change on props -->
    <!-- phase-time will change on props (seperate component?) -->
    <!-- <Clock /> -->
    <!-- ADD DONE BUTTON -->
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Clock from '@/components/gamedashboard/Clock.vue';

@Component({
  components: {
    Clock,
  },
})

export default class Phase extends Vue {
  get currentPhase() {
    return this.$store.state.gamePhase;
  }
}
</script>

<style scoped>
.phase {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50%;
  /* background-color: blue; */
  font-size: 1.5rem;
}

.phase p {
  margin: 0;
}

.phase-title {
  color: #f5f5f5;
}

.phase-current {
  color: #c67b5c;
}

.phase-time {
  color: #c67b5c;
}
</style>
