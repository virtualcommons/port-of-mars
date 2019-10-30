<template>
  <div class="profile">
    <div class="profile-frame">
      <img :src="require(`@/assets/characters/${setImg()}.png`)" alt="Player" class="profile-img" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Profile extends Vue {
  @Prop({ default: 'Curator' }) private playerRole!: string;

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
  justify-content: center;
  align-items: center;
  /* background-color: pink; */
}

.profile p {
  margin: 0;
}

.profile-frame {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 12rem;
  width: 12rem;
  margin: 1rem 0;
  background-color: rgba(245, 245, 245, 0.2);
  border: 0.125rem solid #c67b5c;
  border-radius: 50%;
}

.profile-img {
  height: 100%;
  /* prevent user from highlighting text */
  -webkit-touch-callout: none !important; /* iOS Safari */
  -webkit-user-select: none !important; /* Safari */
  -khtml-user-select: none !important; /* Konqueror HTML */
  -moz-user-select: none !important; /* Old versions of Firefox */
  -ms-user-select: none !important; /* Internet Explorer/Edge */
  user-select: none !important; /* Non-prefixed version, currently
                                     supported by Chrome, Opera and Firefox */
}
</style>
