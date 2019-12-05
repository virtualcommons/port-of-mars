<template>
  <div @click="handleClick" class="member">
    <div class="member-content" :style="{ 'background-color': `var(--color-${playerRole})` }">
      <div class="member-notif-trade" v-if="memberNotificationTradeCount > 0">
        <p class="member-notif-trade-num">{{ memberNotificationTradeCount }}</p>
      </div>
      <div
        class="member-notif-done animated pulse infinite"
        v-if="memberNotificationFinished"
        :style="memberNotificationTradeCount > 0 ? 'left: -0.5rem' : 'left: -0.75rem'"
      ></div>
      <div class="member-info">
        <p class="member-score">{{ playerScore }}</p>
        <p class="member-role">{{ playerRole }}</p>
      </div>
      <div class="member-image">
        <img
          :src="require(`@/assets/characters/${setImg()}.png`)"
          alt="Player"
          class="member-img"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Member extends Vue {
  @Prop({ default: 'Curator' }) private playerRole!: string;

  @Prop({ default: 0 }) private playerScore!: number;

  @Prop({ default: 1 }) private memberNotificationTradeCount!: number;

  @Prop({ default: false }) private memberNotificationFinished!: boolean;

  setImg(): string {
    return this.playerRole;
  }

  handleClick() {
    // this.$store.dispatch('setTradingMember', this.playerRole).then(() => {
    //   this.$root.$emit('openTrading', 'open');
    // });
  }
}
</script>

<style scoped>
.member {
  height: 4rem;
  width: 95%;
  padding: 0.25rem;
  border: 0.125rem solid var(--space-white-opaque-2);
  border-radius: 1rem;
  position: relative;
  transition: all 0.2s ease-in-out;
}

.member:hover {
  width: 100%;
}

.member-content {
  height: 100%;
  width: 100%;
  border-radius: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.member-notif-trade {
  border-radius: 50%;
  position: absolute;
  z-index: 3;
  left: -0.75rem;
  top: -0.75rem;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--space-orange);
}

.member-notif-trade-num {
  margin: 0;
  font-size: var(--font-small) !important;
  text-align: center;
  color: var(--space-gray) !important;
}

.member-notif-done {
  border-radius: 50%;
  position: absolute;
  z-index: 2;
  top: -0.75rem;
  width: 1.5rem;
  height: 1.5rem;
  background-color: var(--status-green);
}

.member-info {
  height: 100%;
  width: 60%;
  flex: 1;
  display: flex;
  align-items: center;
}

.member-score {
  margin-bottom: 0;
  margin: 0 0.5rem;
  color: var(--space-white);
  font-size: var(--font-large);
}

.member-role {
  margin: 0;
  flex: 1;
  font-size: var(--font-med);
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--space-white);
  overflow: hidden;
}

.member-image {
  height: 100%;
  max-width: 40%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.member-image img {
  height: 100%;
  max-height: 4rem;
}
</style>
