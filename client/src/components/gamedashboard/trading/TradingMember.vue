setMember<template>
  <div class="trading-member" :style="setColor()" @click="setMember(playerRole)">
    <div class="trading-member-img">
      <img :src="require(`@/assets/characters/${setImg()}.png`)" alt="Player" />
    </div>
    <div class="trading-member-status">
      <p>{{ notificationCount }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class TradingModal extends Vue {
  @Prop({ default: 'Curator' }) private playerRole!: string;

  @Prop({ default: -1 }) private notificationCount!: number;

  @Prop({ default: false }) private isActive!: boolean;

  setImg(): string {
    return this.playerRole;
  }

  setColor(): object {
    return this.isActive ? { backgroundColor: 'var(--space-orange)' } : { backgroundColor: 'none' };
  }

  setMember(member: string): void {
    this.$store.dispatch('setTradingMember', member);
  }
}
</script>

<style scoped>
.trading-member {
  height: 25%;
  width: 100%;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--space-white);
  cursor: pointer;
}

.trading-member-img {
  height: 100%;
  width: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.trading-member-img img {
  width: 100%;
}

.trading-member-status {
  height: 100%;
  width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.trading-member-status p {
  margin: 0;
}
</style>
