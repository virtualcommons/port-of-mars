<template>
  <div class="profile">
    <div class="profile-frame" id="v-step-0" @click="handleClick">
      <img :src="require(`@/assets/characters/${setImg()}.png`)" alt="Player" class="profile-img" />
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

  setImg(): string {
    return this.playerRole;
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
  border-bottom: 0.125rem solid var(--space-orange);
  margin-bottom: 0.5rem;
}

.profile-info-score {
  font-size: var(--font-med);
}

.profile-frame {
  height: 10vh;
  width: 10vh;
  margin-right: 1rem;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0.125rem solid var(--space-orange);
  border-radius: 50%;
  background-color: rgba(245,245,245, 0.05);
  cursor: pointer;
}

.profile-img {
  height: 100%;
}
</style>
