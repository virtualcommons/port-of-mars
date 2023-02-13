<template>
  <!-- FIXME: remove flex column -->
  <b-container>
    <b-row
      v-b-modal="`${role}-modal`"
      class="flex-column h-100 w-100 m-0 p-0 tour-profile"
      style="cursor: pointer"
    >
      <b-row
        class="p-1 my-2 mx-auto"
        :style="indicatorStyle"
        style="
          border-radius: 50%;
          transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;
          height: 10rem;
          width: 10rem;
        "
      >
        <b-col class="h-100 w-100 m-0 p-0" style="border-radius: 50%" :style="frameColor">
          <b-img
            rounded="circle"
            v-bind="avatar"
            :src="roleImage"
            alt="Player Image"
            class="my-3"
          ></b-img>
        </b-col>
      </b-row>
      <b-row class="flex-column text-center">
        <p class="mb-1" style="color: rgb(202, 166, 110); font-weight: bold">Your Role</p>
        <p class="mb-1" style="color: rgb(241, 224, 197); font-weight: bold">{{ role }}</p>
        <p class="m-0" style="color: rgb(241, 224, 197); font-weight: bold">
          Score: {{ playerScore }}
        </p>
      </b-row>
    </b-row>
    <!-- modal -->
    <b-modal
      :id="`${role}-modal`"
      :title="`CONFIDENTIAL: ${role} Dossier`"
      centered
      no-stacking
      hide-footer
      header-bg-variant="primary"
      header-border-variant="primary"
      body-bg-variant="dark"
      size="xl"
    >
      <PlayerModal :role="role"></PlayerModal>
    </b-modal>
  </b-container>
</template>

<script lang="ts">
import { Vue, Component, Inject } from "vue-property-decorator";
import { Role } from "@port-of-mars/shared/types";
import { TutorialAPI } from "@port-of-mars/client/api/tutorial/request";
import PlayerModal from "@port-of-mars/client/components/game/modals/PlayerModal.vue";
@Component({
  components: {
    PlayerModal,
  },
})
export default class Player extends Vue {
  @Inject()
  readonly api!: TutorialAPI;

  avatar = {
    center: true,
    fluid: true,
    blankColor: "#bbb",
    width: 200,
    height: 200,
  };

  get role(): Role {
    return this.$tstore.state.role;
  }

  get playerScore(): number {
    return this.role ? this.$tstore.state.players[this.role].victoryPoints : 0;
  }

  get playerReady() {
    return this.$store.getters.player.ready;
  }

  get frameColor(): object {
    return this.role
      ? { backgroundColor: `var(--color-${this.role})` }
      : { backgroundColor: `var(--color-Researcher)` };
  }

  get indicatorStyle() {
    return !this.playerReady
      ? { border: `0.25rem solid var(--color-${this.role})` }
      : { border: `0.25rem solid var(--green)` };
  }

  get roleImage(): any {
    return this.role
      ? require(`@port-of-mars/client/assets/characters/${this.role}.png`)
      : require(`@port-of-mars/client/assets/characters/Researcher.png`);
  }
}
</script>
