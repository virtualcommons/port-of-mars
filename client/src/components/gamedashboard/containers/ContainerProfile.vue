<template>
  <div class="profile">
    <div class="profile-frame" id="v-step-0">
      <img :src="avatarURL" alt="Player" class="profile-img" />
    </div>
    <div class="profile-info">
      <p class="profile-info-player">{{ playerRole }}</p>
      <p class="profile-info-score">Score: {{ playerScore }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class ContainerProfile extends Vue {
  get playerRole() {
    return this.$store.state.playerRole;
  }

  get playerScore() {
    return this.$store.state.playerScore;
  }

  get avatarURL(): string {
    if (this.playerRole !== '') {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      return require(`@/assets/characters/${this.playerRole}.png`);
    }
    // eslint-disable-next-line global-require,import/no-dynamic-require
    return require('@/assets/characters/Curator.png');
  }
}
</script>

<style scoped>
@media (max-width: 1680px) {
  .profile {
    flex-direction: column-reverse;
  }

  .profile-frame {
    margin-top: 2rem;
    margin-right: 0 !important;
  }
}

.profile {
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-info-player,
.profile-info-score {
  margin: 0;
  color: var(--space-white);
}

.profile-info-player {
  padding: 0 0.5rem;
  margin-bottom: 0.5rem;
  font-size: var(--font-large);
  color: var(--space-gray);
  background-color: var(--space-white);
}

.profile-info-score {
  font-size: var(--font-med);
}

.profile-frame {
  height: 5rem;
  width: 5rem;
  padding: 0.25rem;
  border: 0.125rem solid var(--space-orange);
  border-radius: 50%;
  margin-right: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--space-white-opaque-1);
}

.profile-img {
  height: 100%;
}
</style>
