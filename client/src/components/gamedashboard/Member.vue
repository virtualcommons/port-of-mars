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
    this.$store.dispatch('setTradingMember', this.playerRole).then(() => {
      this.$root.$emit('openTrading', 'open');
    });
  }
}
</script>

<style scoped>
.member {
  height: 4rem;
  width: 90%;
  padding: 0.25rem 1rem;
  border: var(--border-white);
  border-radius: 1rem;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(245, 245, 245, 0.2);
  cursor: pointer;
  transition: all .2s ease-in-out;
}

.member:hover {
  width: 100%;
}

.member-notif {
  border-radius: 50%;
  position: absolute;
  left: -0.75rem;
  top: -0.75rem;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--space-orange);
}

.member-notif-num {
  margin: 0;
  font-size: var(--font-small) !important;
  text-align: center;
  color: var(--space-gray) !important;
}

.member-score {
  margin: 0;
  color: var(--space-white);
  font-size: var(--font-large);
}

.member-role {
  padding: 0 0.25rem;
  margin: 0;
  font-size: var(--font-med);
  color: var(--space-white);
}

.member-img {
  height: 100%;
}
</style>
