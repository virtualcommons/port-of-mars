<template>
  <b-row class="h-100 w-100 m-0 p-0">
    <transition name="component-fade" mode="out-in">
      <component :is="phase[gamePhase]"></component>
    </transition>
  </b-row>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import Invest from "@port-of-mars/client/components/game/phases/Investments.vue";
import Trade from "@port-of-mars/client/components/game/phases/Trades.vue";
import Purchase from "@port-of-mars/client/components/game/phases/Purchase.vue";
import Discard from "@port-of-mars/client/components/game/phases/Discard.vue";
import Events from "@port-of-mars/client/components/game/phases/Events.vue";
import Default from "@port-of-mars/client/components/game/phases/Default.vue";
import NewRound from "@port-of-mars/client/components/game/phases/NewRound.vue";
import { Phase } from "@port-of-mars/shared/types";

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

  @Watch("gamePhase", { immediate: true })
  hideGameModal() {
    this.$root.$emit("bv::hide::modal", "gameModal");
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
