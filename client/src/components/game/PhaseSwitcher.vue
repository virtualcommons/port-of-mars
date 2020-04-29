<template>
  <div class="c-phase-switcher">
    <div class="wrapper row">
      <transition name="component-fade" mode="out-in">
        <component v-bind:is="phase[gamePhase]"></component>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Invest from './phases/Investments.vue';
import Trade from './phases/Trades.vue';
import Purchase from './phases/Purchase.vue';
import Discard from './phases/Discard.vue';
import Events from './phases/Events.vue';
import Default from './phases/Default.vue';
import { Phase } from '@port-of-mars/shared/types';

@Component({
  components: {
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
@import '@port-of-mars/client/stylesheets/game/PhaseSwitcher.scss';
</style>
