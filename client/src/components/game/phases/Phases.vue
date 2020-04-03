<template>
  <div class="c-phasecontainer row">
    <div class="content">
      <Events v-if="gamePhase == phase.events"  />
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
import Investments from './Investments.vue'
import Trades from './Trades.vue';
import Purchase from './Purchase.vue';
import Discard from './Discard.vue';
import Events from './Events.vue';
import Default from './Default.vue';

import { Phase } from '@port-of-mars/shared/types';
@Component({
  components: {
    Trades,
    Purchase,
    Discard,
    Events,
    Investments,
    Default,
  }
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
@import '@port-of-mars/client/stylesheets/game/phases/Phases.scss';
</style>
