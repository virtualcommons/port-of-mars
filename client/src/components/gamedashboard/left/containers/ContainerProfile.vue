<template>
  <div class="profile tour-profile">
    <div class="p-container">
      <div class="frame-outer">
        <div  class="frame-inner" :style="{'backgroundColor':`var(--color-${playerRole})`}">
          <img :src="playerRoleImg" alt="Player" />
        </div>
      </div>
      <p>{{ playerRole }}</p>
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

  get playerRoleImg(): string {
    return require(`@/assets/characters/${this.playerRole}.png`);
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/left/containers/ContainerProfile.scss';

</style>
