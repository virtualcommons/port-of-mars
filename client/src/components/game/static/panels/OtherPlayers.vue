<template>
  <b-container>
    <b-row
      class="m-0 p-0"
      style="
        cursor: pointer;
        transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;
      "
      fluid
      v-b-modal="`${role}-modal`"
    >
      <b-col cols="3" class="h-100 w-100">
        <b-row
          :style="indicatorStyle"
          class="p-1 my-2 mx-auto"
          style="
            border-radius: 50%;
            height: 4rem;
            width: 4rem;
            transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;
          "
        >
          <b-col :style="frameColor" class="w-100 h-100 m-0 p-0" style="border-radius: 50%">
            <img
              :src="playerRoleImage"
              alt="Player Image"
              style="object-fit: cover"
              class="w-100 h-100 m-0 p-0"
            />
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="9" class="h-100 w-100 my-2">
        <p class="font-weight-bold m-0 p-0" style="font-size: 1.5rem">{{ role }}</p>
        <p class="font-weight-bold m-0 p-0" style="font-size: 1rem">Score: {{ victoryPoints }}</p>
      </b-col>
    </b-row>
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
import { Component, Inject, Prop, Vue } from "vue-property-decorator";
import { GameRequestAPI } from "@port-of-mars/client/api/game/request";
import { Role } from "@port-of-mars/shared/types";
import PlayerModal from "@port-of-mars/client/components/game/modals/PlayerModal.vue";

@Component({
  components: {
    PlayerModal,
  },
})
export default class OtherPlayers extends Vue {
  @Inject() readonly api!: GameRequestAPI;
  @Prop() role!: Role;
  @Prop() ready!: boolean;
  @Prop() victoryPoints!: number;

  get frameColor(): object {
    return this.role
      ? { backgroundColor: `var(--color-${this.role})` }
      : { backgroundColor: `var(--color-Researcher)` };
  }

  get indicatorStyle() {
    return !this.ready
      ? { border: `0.125rem solid var(--color-${this.role})` }
      : { border: `0.125rem solid var(--green)` };
  }

  get playerRoleImage(): any {
    return this.role
      ? require(`@port-of-mars/client/assets/characters/${this.role}.png`)
      : require(`@port-of-mars/client/assets/characters/Researcher.png`);
  }
}
</script>
