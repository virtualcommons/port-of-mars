<template>
  <div class="profile tour-profile">
    <div class="p-container">
      <div class="frame-outer" @click="handleOpenModal">
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
    return require(`@port-of-mars/client/assets/characters/${this.playerRole}.png`);
  }

  handleOpenModal(){
    this.$tstore.commit('SET_PLAYER_INFO_MODAL_VISIBILITY',{
      role:this.playerRole,
      visible:true
    });
  }

}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/left/containers/ContainerProfile.scss';

</style>
