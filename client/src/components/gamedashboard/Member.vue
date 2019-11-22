<template>
  <div @click="handleClick" class="member">
    <div :style="setVisibility()" class="member-notif">
      <p class="member-notif-num">{{ notificationCount }}</p>
    </div>
    <div class="member-info">
      <p class="member-score">{{ playerScore }}</p>
      <p class="member-role">{{ playerRole }}</p>
    </div>
    <div class="member-image">
      <img :src="require(`@/assets/characters/${setImg()}.png`)" alt="Player" class="member-img" />
    </div>
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
  width: 95%;
  padding: 0.25rem 0.5rem;
  border: var(--border-white);
  border-radius: 1rem;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(245, 245, 245, 0.2);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
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

.member-info {
  height: 100%;
  width: 60%;
  flex: 1;
  display: flex;
  align-items: center;
}

.member-score {
  margin-bottom: 0;
  margin-right: 0.5rem;
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
