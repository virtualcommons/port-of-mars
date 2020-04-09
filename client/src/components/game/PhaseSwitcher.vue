<template>
  <div class="c-phaseswitcher container">
    <div class="wrapper row">
      <Events v-if="gamePhase == phase.events" />
      <Investments v-if="gamePhase == phase.invest" />
      <Trades v-else-if="gamePhase == phase.trade" />
      <Purchase v-else-if="gamePhase == phase.purchase" />
      <Discard v-else-if="gamePhase == phase.discard" />
      <Default v-else />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Investments from './phases/Investments.vue';
import Trades from './phases/Trades.vue';
import Purchase from './phases/Purchase.vue';
import Discard from './phases/Discard.vue';
import Events from './phases/Events.vue';
import Default from './phases/Default.vue';

import { Phase } from '@port-of-mars/shared/types';
@Component({
  components: {
    Trades,
    Purchase,
    Discard,
    Events,
    Investments,
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
