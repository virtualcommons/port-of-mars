<template>
  <b-container fluid class="h-100 p-0 m-0">
    <b-row class="h-100 px-3">
      <transition name="component-fade" mode="out-in">
        <component v-bind:is="phase[gamePhase]"></component>
      </transition>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Invest from './phases/Investments.vue';
import Trade from './phases/Trades.vue';
import Purchase from './phases/Purchase.vue';
import Discard from './phases/Discard.vue';
import Events from './phases/Events.vue';
import Default from './phases/Default.vue';
import NewRound from './phases/NewRound.vue';
import { Phase } from '@port-of-mars/shared/types';

@Component({
  components: {
    NewRound,
    Trade,
    Purchase,
    Discard,
    Events,
    Invest,
    Default,
  },
})
export default class Phases extends Vue {
  get phase() {
    return Phase;
  }

  get gamePhase() {
    return this.$store.state.phase;
  }
}
</script>

<style lang="scss" scoped>
.component-fade-enter-active {
  animation: fade-in 0.5s;
}

.component-fade-leave-active {
  animation: fade-out 0.5s;
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }

  100% {
    opacity: 100%;
    transform: translateX(0);
  }
}

@keyframes fade-out {
  0% {
    opacity: 100;
    transform: translateX(0px);
  }

  100% {
    opacity: 0%;
    transform: translateX(20px);
  }
}
</style>
