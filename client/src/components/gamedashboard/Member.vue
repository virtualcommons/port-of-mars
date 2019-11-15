<template>
  <div @click="handleClick" class="member">
    <div :style="setVisibility()" class="member-notif">
      <p class="member-notif-num">{{ notificationCount }}</p>
    </div>
    <p class="member-score">{{ playerScore }}</p>
    <p class="member-role">{{ playerRole }}</p>
    <img :src="require(`@/assets/characters/${setImg()}.png`)" alt="Player" class="member-img" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Member extends Vue {
  @Prop({ default: 'Curator' }) private playerRole!: string;

  @Prop({ default: 0 }) private playerScore!: number;

  @Prop({ default: 1 }) private notificationCount!: number;

  setImg(): string {
    return this.playerRole;
  }

  setVisibility(): object {
    return this.notificationCount > 0 ? { visibility: 'visible' } : { visibility: 'hidden' };
  }

  handleClick() {
    this.$store.dispatch('setTradingMember', this.playerRole);
    // async (does this need a callback)?
    this.$root.$emit('openTrading', 'open');
  }
}
</script>

<style scoped>
.member {
  /* overflow: hidden; */
  width: 90%;
  padding: 0.25rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  height: 4rem;
  background-color: rgba(245, 245, 245, 0.2);
  border: var(--border-white);
  border-radius: 1rem;
  cursor: pointer;
  transition: all .2s ease-in-out;
}

.member:hover {
  width: 100%;
}

.member-notif {
  position: absolute;
  left: -0.75rem;
  top: -0.75rem;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--space-orange);
  border-radius: 50%;
}

.member-notif-num {
  text-align: center;
  font-size: var(--font-small) !important;
  color: var(--space-gray) !important;
  margin: 0;
}

.member-score {
  color: var(--space-white);
  font-size: var(--font-large);
  margin: 0;
}

.member-role {
  padding: 0 0.25rem;
  color: var(--space-white);
  font-size: var(--font-med);
  margin: 0;
}

.member-img {
  height: 100%;
}
</style>
