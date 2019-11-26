<template>
  <div class="profile" id="v-step-0">
    <div class="profile-frame-info">
      <div class="profile-frame">
        <img :src="avatarURL" alt="Player" class="profile-img" />
      </div>
      <div class="profile-info">
        <p class="profile-info-player">{{ playerRole }}</p>
        <p class="profile-info-score">Score: {{ playerScore }}</p>
      </div>
    </div>
    <div class="profile-investments">
      <div class="profile-investments-col">
        <div class="profile-investments-row">
          <img :src="require('@/assets/iconsSVG/upkeep.svg')" alt="Upkeep" />
          <p>1</p>
        </div>
        <div class="profile-investments-row">
          <img :src="require('@/assets/iconsSVG/government.svg')" alt="Government" />
          <p>1</p>
        </div>
      </div>
      <div class="profile-investments-col">
        <div class="profile-investments-row">
          <img :src="require('@/assets/iconsSVG/science.svg')" alt="Science" />
          <p>1</p>
        </div>
        <div class="profile-investments-row">
          <img :src="require('@/assets/iconsSVG/legacy.svg')" alt="Legacy" />
          <p>1</p>
        </div>
      </div>
      <div class="profile-investments-col">
        <div class="profile-investments-row">
          <img :src="require('@/assets/iconsSVG/finance.svg')" alt="Finance" />
          <p>1</p>
        </div>
        <div class="profile-investments-row">
          <img :src="require('@/assets/iconsSVG/culture.svg')" alt="Culture" />
          <p>1</p>
        </div>
      </div>
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
.profile {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.profile-frame-info {
  padding-bottom: 1rem;
  display: flex;
  justify-content: flex-start;
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

.profile-investments {
  margin-top: 1rem;
  display: flex;
  justify-content: space-around;
}

.profile-investments-row {
  padding: 0.25rem;
  border-radius: 1.75rem;
  margin: 0.5rem 0;
  border: 0.125rem solid var(--space-white-opaque-2);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  /* background-color: var(--space-white-opaque-1); */
}

.profile-investments-row img {
  height: 1.5rem;
  width: 1.5rem;
}

.profile-investments-row p {
  margin: 0 1rem;
  font-size: var(--font-small);
  color: var(--space-white);
}

.profile-investments-row span {
  color: var(--space-orange);
}

@media (max-width: 1366px) {
  .profile-info-player {
    font-size: var(--font-med);
  }
  .profile-frame {
    height: 4rem;
    width: 4rem;
  }
  .profile-investments-row img {
    height: 1.25rem;
    width: 1.25rem;
  }
}
</style>
