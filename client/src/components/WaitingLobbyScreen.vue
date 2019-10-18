<template>
  <div class="waiting-lobby-screen">
    <Clock />
    <PortOfMarsLogo />
    <PlanetMars />
    <WaitingLobbyCapacity />
    <GameplayGuide />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import PortOfMarsLogo from '@/components/PortOfMarsLogo.vue';
import Clock from '@/components/Clock.vue';
import PlanetMars from '@/components/PlanetMars.vue';

  @Component({
    components: {
      WaitingLobbyCapacity,
      PortOfMarsLogo,
      Clock,
      GameplayGuide,
      PlanetMars,
    },
  })

export default class WaitingLobbyScreen extends Vue {
  // mounted() {}
}
</script>

<style scoped>
  .waiting-lobby-screen {
    /*container position*/
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;

    /*container styling*/
    font-weight: 100;
    letter-spacing: 0.5rem;
    transition: all 0.2s;
  }
</style>
