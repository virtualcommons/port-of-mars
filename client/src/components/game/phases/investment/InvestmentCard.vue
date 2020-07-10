<template>
  <div class="card-investment v-step-15">
    <div :style="opacity" class="wrapper">
      <div class="type">
        <p class="name">{{ label }}</p>
        <img
          :src="require(`@port-of-mars/client/assets/icons/${name}.svg`)"
          alt="Player"
        />
        <div class="data">
          <div
            :style="{
              visibility:
                !disabled && pendingUnits !== 0 ? 'visible' : 'hidden',
            }"
            class="investment"
          >
            <font-awesome-icon
              :icon="['fas', 'briefcase']"
              class="icon"
              size="lg"
            />
            <p><span>+</span>{{ pendingUnits }}</p>
          </div>
          <div
            :style="{ visibility: !disabled ? 'visible' : 'hidden' }"
            class="cost"
            id="tooltip-cost"
          >
            <font-awesome-icon
              :icon="['fas', 'clock']"
              class="icon m-2"
              size="lg"
            />
            <p>
              {{ !disabled ? cost : 'X' }}
            </p>
          </div>
        </div>
      </div>

      <div v-bind="{ class: playerReady ? 'increment-decrement-disabled' : 'increment-decrement'}"
           v-if="!disabled">
        <!-- increment button -->
        <button
          @click="setInvestmentAmount(1)"
          class="increment"
          name="Investment Increment"
          type="button"
        >
          +
        </button>

        <!-- decrement button -->
        <button
          @click="setInvestmentAmount(-1)"
          class="decrement"
          name="Investment Decrement"
          type="button"
        >
          -
        </button>
      </div>
      <div class="increment-decrement-disabled" v-if="disabled"></div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {library} from '@fortawesome/fontawesome-svg-core';
  import {faClock} from '@fortawesome/free-solid-svg-icons/faClock';
  import {faBriefcase} from '@fortawesome/free-solid-svg-icons/faBriefcase';
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
  import {Resource} from '@port-of-mars/shared/types';
  import {COST_INAFFORDABLE} from "@port-of-mars/shared/settings";

  library.add(faClock);
  library.add(faBriefcase);
  Vue.component('font-awesome-icon', FontAwesomeIcon);

  @Component({})
  export default class InvestmentCard extends Vue {
    @Prop() private name!: Resource;
    @Prop() private cost!: number;
    @Prop() private pendingInvestment!: number;

    get disabled(): boolean {
      return this.cost >= COST_INAFFORDABLE || this.playerReady;
    }

    get opacity(): object {
      return this.disabled ? {opacity: '0.5'} : {};
    }

    get pendingUnits() {
      const pendingUnits = this.$tstore.getters.player.pendingInvestments[
        this.name
        ];
      if (pendingUnits) return pendingUnits;
      return 0;
    }

    get label() {
      return this.name == ('upkeep' as any) ? 'System Health' : this.name;
    }

    get playerReady() {
      return this.$tstore.getters.player.ready;
    }

    private setInvestmentAmount(diff: number): void {
      this.$emit('input', {
        name: this.name,
        units: this.pendingInvestment + diff,
        cost: this.cost,
      });
    }
  }
</script>
,
<style lang="scss" scoped>
  @import '@port-of-mars/client/stylesheets/game/phases/investment/InvestmentCard.scss';
</style>
