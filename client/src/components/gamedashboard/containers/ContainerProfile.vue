<template>
  <div class="profile">
    <div class="profile-frame" id="v-step-0" @click="handleClick">
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
  @Prop({ default: 'Curator' }) private playerRole!: string;

  @Prop({ default: 0 }) private playerScore!: number;

  get avatarURL(): string {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    return require(`@/assets/characters/${this.playerRole}.png`);
  }

  handleClick() {
    this.$root.$emit('openProfile', 'open');
  }
}
</script>

<style scoped>

@media (max-width: 1680px) {
  .profile {
    flex-direction: column-reverse;
  }

  .profile-frame {
    margin-right: 0 !important;
    margin-top: 2rem;
  }
}

.profile {
  /* height: 100%; */
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-info-player, .profile-info-score {
  margin: 0;
  color: var(--space-white);
}

.profile-info-player {
  font-size: var(--font-large);
  background-color: var(--space-white);
  padding: 0 0.5rem;
  /* padding-right: 1rem; */
  /* border-radius: 0 0.75rem 0.75rem 0; */
  color: var(--space-gray);
  /* border-bottom: 0.125rem solid var(--space-orange); */
  margin-bottom: 0.5rem;
}

.profile-info-score {
  font-size: var(--font-med);
}

.profile-frame {
  height: 5rem;
  width: 5rem;
  margin-right: 1rem;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0.125rem solid var(--space-orange);
  border-radius: 50%;
  background-color: var(--space-white-opaque);
  cursor: pointer;
  transition: all .2s ease-in-out;
}

.profile-frame:hover {
  transform: scale(1.1);
}

.profile-img {
  height: 100%;
}
</style>
