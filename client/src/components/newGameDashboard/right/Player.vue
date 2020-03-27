<template>
  <div
    @mouseover="hover = true"
    @mouseleave="hover = false"
    :style="adjustHeight()"
    class="player"
    @click="handleOpenModal"
  >
    <div class="ready" v-if="ready"></div>

    <!-- if audit event is not drawn, show only score and role -->
    <div
      v-if="!isUnderAudit || (isUnderAudit && !hover)"
      class="p-container"
      :style="{ 'background-color': `var(--color-${role})` }"
    >
      <div class="score-and-role">
        <p class="score">{{ victoryPoints }}</p>
        <p>{{ role }}</p>
      </div>
      <img :src="require(`@port-of-mars/client/assets/characters/${role}.png`)" alt="Player" />
    </div>

    <!-- if audit event is drawn, show resources in addition to score and role -->
    <div v-if="isUnderAudit && hover" class="audit-view">
      <div class="audit-investment">
        <p>Totals</p>
      </div>
      <div
        v-for="investment in auditInvestments"
        :key="investment.name"
        class="audit-investment"
      >
        <img
          :src="require(`@port-of-mars/client/assets/icons/${investment.name}.svg`)"
          alt="Investment"
        />
        <p>{{ investment.units }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Resource, RESOURCES, Role } from '@port-of-mars/shared/types';

@Component({})
export default class Player extends Vue {
  @Prop() private role!: string;
  @Prop() private ready!: boolean;
  @Prop() private victoryPoints!: number;
  private hover: boolean = false;

  get isUnderAudit(): boolean {
    return this.$tstore.getters.isUnderAudit;
  }

  get auditInvestments(): object {
    const inventory = this.$store.state.players[this.role].inventory;
    return RESOURCES.map(name => ({
      name,
      units: inventory[name as Resource]
    }));
  }

  private adjustHeight(): object {
    if (this.isUnderAudit) {
      return { height: '3.25rem', cursor: 'pointer' };
    } else {
      return { height: '3rem' };
    }
  }

  handleOpenModal(){
    this.$tstore.commit('SET_PLAYER_INFO_MODAL_VISIBILITY',{
      role:this.role as Role,
      visible:true
    });
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/right/Player.scss';
</style>
