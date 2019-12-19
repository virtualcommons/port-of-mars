<template>
  <div class="profile">
    <div class="profile-frame-info">
      <div class="profile-frame-outer">
        <div class="profile-frame-inner">
          <img :src="avatarURL" alt="Player" class="profile-img" />
        </div>
      </div>
      <div class="profile-info">
        <p class="profile-info-player">{{ playerRole }}</p>
        <!-- <p class="profile-info-score">Score: {{ playerScore }}</p> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class ContainerProfile extends Vue {
  get playerRole() {
    return this.$tstore.state.role;
  }

  get playerScore() {
    return this.$tstore.getters.player.victoryPoints;
  }

  get avatarURL(): string {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    return require(`@/assets/characters/${this.playerRole}.png`);
  }
}
</script>

<style scoped>
.profile {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* background-color: var(--space-white-opaque-1); */
}

.profile-frame-info {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

.profile-info-player,
.profile-info-score {
  margin: 0;
  color: var(--space-white);
}

.profile-info-player {
  flex-grow: 1;
  padding: 0 0.5rem;
  margin-bottom: 0.5rem;
  font-size: var(--font-large);
  color: var(--space-gray);
  background-color: var(--space-white);
}

.profile-info-score {
  font-size: var(--font-med);
}

.profile-frame-outer {
  height: 5rem;
  width: 5rem;
  padding: 0.25rem;
  border: 0.125rem solid var(--space-orange-opaque-2);
  border-radius: 50%;
  margin-bottom: 1rem;
}

.profile-frame-inner {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--space-white-opaque-1);
}

.profile-img {
  height: 80%;
}
</style>
