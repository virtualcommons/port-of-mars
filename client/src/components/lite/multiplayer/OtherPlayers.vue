<template>
  <div class="d-flex flex-row m-0 p-0">
    <div cols="3" class="h-100 w-100">
      <div
        :style="indicatorStyle"
        class="p-1 my-2 mx-auto"
        style="
          border-radius: 50%;
          height: 3rem;
          width: 3rem;
          transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;
        "
      >
        <div :style="frameColor" class="w-100 h-100 m-0 p-0" style="border-radius: 50%">
          <img
            :src="playerRoleImage"
            alt="Player Image"
            style="object-fit: cover"
            class="w-100 h-100 m-0 p-0"
          />
        </div>
      </div>
    </div>
    <div class="h-100 w-100 mx-2 mt-2">
      <div class="d-flex flex-row">
        <p class="font-weight-bold m-0 p-0" style="font-size: 1.2rem">Player&nbsp;{{ index }}</p>
        <b-badge v-if="isSelf" class="ml-2 p-2" variant="primary">You</b-badge>
      </div>
      <b-badge v-if="hasInvested" class="ml-2 p-1" variant="success">Invested</b-badge>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Role } from "@port-of-mars/shared/types";
import PlayerModal from "@port-of-mars/client/components/game/modals/PlayerModal.vue";

@Component({
  components: {
    PlayerModal,
  },
})
export default class OtherPlayers extends Vue {
  @Prop() role!: Role;
  @Prop() index!: number;
  @Prop() isSelf!: boolean;
  @Prop() hasInvested!: boolean;

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
      ? this.$getAssetUrl(`characters/${this.role}.png`)
      : this.$getAssetUrl(`characters/Researcher.png`);
  }
}
</script>
