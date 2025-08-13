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
        <p class="font-weight-bold m-0 p-0">
          <span>{{ player.role }}</span>
        </p>
        <b-badge v-if="isSelf" class="ml-2 pt-2" variant="primary">You</b-badge>
        <b-badge v-else class="ml-2 pt-2" variant="light">{{ player.points }}</b-badge>
      </div>
      <b-badge v-if="player.hasInvested" class="ml-2 p-1" variant="success">Invested</b-badge>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { LiteGamePlayerClientState } from "@port-of-mars/shared/lite";

@Component({})
export default class OtherPlayers extends Vue {
  @Prop() index!: number;
  @Prop() player!: LiteGamePlayerClientState;
  @Prop() isSelf!: boolean;

  get frameColor(): object {
    return this.player.role
      ? { backgroundColor: `var(--color-${this.player.role})` }
      : { backgroundColor: `var(--color-Researcher)` };
  }

  get indicatorStyle() {
    return !this.player.hasInvested
      ? { border: `0.125rem solid var(--color-${this.player.role})` }
      : { border: `0.125rem solid var(--green)` };
  }

  get playerRoleImage(): any {
    return this.player.role
      ? this.$getAssetUrl(`characters/${this.player.role}.png`)
      : this.$getAssetUrl(`characters/Researcher.png`);
  }
}
</script>
