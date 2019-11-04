<template>
  <div class="profile">
    <div class="profile-frame" id="v-step-0">
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

export default class Profile extends Vue {
  @Prop({ default: 'Curator' }) private playerRole!: string;

  @Prop({ default: 0 }) private playerScore!: number;

  setImg(): string {
    return this.playerRole;
  }
}
</script>

<style scoped>
.profile {
  height: 100%;
  width: 100%;
  display: flex;
  /* flex-direction: column; */
  justify-content: space-around;
  align-items: center;
  /* background-color: pink; */
}

.profile-info-player, .profile-info-score {
  color: #F5F5F5;
  margin: 0;
}

.profile-info-player {
  font-size: 1.5rem;
}

.profile-info-score {
  font-size: 1rem;
}

.profile-frame {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 8rem;
  width: 8rem;
  margin: 1rem 0;
  /* background-color: rgba(245, 245, 245, 0.2); */
  background-color: rgba(245,245,245, 0.05);
  border: 0.125rem solid #c67b5c;
  border-radius: 50%;
  cursor: pointer;
}

.profile-img {
  height: 100%;
}
</style>
