<template>
  <b-row
    v-b-modal="'gameModal'"
    @click="handleOpenModal()"
    class="flex-column h-100 w-100 m-0 p-0 tour-profile"
    style="cursor: pointer"
  >
    <b-row class="p-1 my-2 mx-auto" :style="indicatorStyle" style="border-radius: 50%;
           transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;
           height: 10rem; width: 10rem;">
      <b-col class="h-100 w-100 m-0 p-0" style="border-radius: 50%" :style="frameColor">
        <img :src="playerRoleImage" alt="Player Image" style="object-fit: cover" class="my-3" />
      </b-col>
    </b-row>
    <b-row class="flex-column text-center">
      <p class="mb-1" style="color: rgb(202, 166, 110); font-weight: bold;">Your Role</p>
      <p class="mb-1" style="color: rgb(241, 224, 197); font-weight: bold;">{{ playerRole }}</p>
      <p class="m-0" style="color: rgb(241, 224, 197); font-weight: bold;">Score: {{ playerScore }}</p>
    </b-row>
  </b-row>
</template>

<script lang="ts">
import { Vue, Component, Inject, Prop } from 'vue-property-decorator';
import { Role } from '@port-of-mars/shared/types';
import { TutorialAPI } from '@port-of-mars/client/api/tutorial/request';
@Component({
  components: {},
})
export default class Player extends Vue {
  @Inject()
  readonly api!: TutorialAPI;

  get playerRole(): Role {
    return this.$tstore.state.role;
  }

  get playerScore(): number {
    return this.playerRole
      ? this.$tstore.state.players[this.playerRole].victoryPoints
      : 0;
  }

  get playerReady() {
    return this.$store.getters.player.ready;
  }

  get frameColor(): object {
    return this.playerRole
      ? { backgroundColor: `var(--color-${this.playerRole})` }
      : { backgroundColor: `var(--color-Researcher)` };
  }

  get indicatorStyle() {
    return !this.playerReady
      ? { border: `0.25rem solid var(--color-${this.playerRole})` }
      : { border: `0.25rem solid var(--green)` };
  }

  get playerRoleImage(): any {
    return this.playerRole
      ? require(`@port-of-mars/client/assets/characters/${this.playerRole}.png`)
      : require(`@port-of-mars/client/assets/characters/Researcher.png`);
  }

  handleOpenModal() {
    let data = {
      type: 'PlayerModal',
      data: {
        role: this.playerRole,
      },
    };
    this.api.setModalVisible(data);
  }
}
</script>
