<template>
  <div
    @mouseover="hover = true"
    @mouseleave="hover = false"
    :style="adjustHeight()"
    class="player"
  >
    <div class="ready" v-if="ready"></div>
    <div
      v-if="layout !== 'AUDIT' || (layout === 'AUDIT' && hover === false)"
      class="p-container"
      :style="{ 'background-color': `var(--color-${role})` }"
    >
      <div class="score-and-role">
        <p class="score">{{ victoryPoints }}</p>
        <p>{{ role }}</p>
      </div>
      <img :src="require(`@/assets/characters/${role}.png`)" alt="Player" />
    </div>
    <div class="audit-view" v-if="layout === 'AUDIT' && hover">
      <div class="audit-investment">
        <p>Totals</p>
      </div>
      <div
        v-for="investment in auditInvestments"
        :key="investment.name"
        class="audit-investment"
      >
        <img
          :src="require(`@/assets/icons/${investment.name}.svg`)"
          alt="Investment"
        />
        <p>{{ investment.units }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Resource, RESOURCES } from 'shared/types';

@Component({})
export default class Player extends Vue {
  @Prop() private role!: string;
  @Prop() private ready!: boolean;
  @Prop() private victoryPoints!: number;
  private hover: boolean = false;

  // TODO: REFACTOR TO TYPESCRIPT
  get layout(): any {
    return this.$tstore.state.eventView;
  }

  // TODO: REFACTOR TO TYPESCRIPT
  get auditInvestments(): any {
    const inventory = this.$store.state.players[this.role].inventory;
    return RESOURCES.map(name => ({
      name,
      units: inventory[name as Resource]
    }));
  }

  // TODO: REMOVE IF UNNECESSARY
  private adjustHeight(): string {
    if (this.layout === 'AUDIT') {
      return { height: '3.25rem', cursor: 'pointer' };
    } else {
      return { height: '3rem' };
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/right/Player.scss';
</style>
