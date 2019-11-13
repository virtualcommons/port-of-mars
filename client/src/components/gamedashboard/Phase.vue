<template>
  <div class="phase-component" id="v-step-7">
    <div>
      <p class="phase-title">Current Phase</p>
      <p class="phase-current">{{ currentPhase }}</p>
    </div>
    <div>
      <p class="phase-time"><span>( </span>5:00<span> )</span></p>
    </div>
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
.phase-component {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 60%;
  /* background-color: var(--space-orange); */
  text-align: center;
}

.phase-component p {
  margin: 0;
}

.phase-title {
  font-size: var(--font-large);
  color: var(--space-white);
}

.phase-current {
  font-size: var(--font-med);
  color: var(--space-orange);
}

.phase-time {
  font-size: var(--font-large);
  color: var(--space-orange);
}

.phase-time span {
  color: var(--space-white);
}
</style>
