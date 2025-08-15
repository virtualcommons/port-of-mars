<template>
  <div class="p-2">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0">Players</h4>
    </div>

    <div class="d-flex flex-wrap gap-3">
      <div
        v-for="[playerId, player] in Array.from(players)"
        :key="playerId"
        class="d-flex flex-column align-items-center"
      >
        <div class="position-relative">
          <img
            :src="$getAssetUrl(`characters/${player.role}.png`)"
            :alt="player.role"
            class="img-fluid"
            :class="{ 'border border-success': player.hasInvested }"
            style="max-width: 80px; height: auto"
          />
        </div>
        <div class="text-center">
          <div class="fw-bold">{{ player.role }}</div>
          <div class="text-muted small d-flex align-items-center justify-content-center gap-1">
            <span v-if="player.role === currentPlayerRole" class="badge text-white bg-primary"
              >You</span
            >
            &nbsp;
            <span>{{ player.points }} pts</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { LiteGamePlayerClientState } from "@port-of-mars/shared/lite/types";
import { Role } from "@port-of-mars/shared/types";

@Component({})
export default class PlayerIndicators extends Vue {
  @Prop({ required: true }) players!: Map<string, LiteGamePlayerClientState>;
  @Prop({ required: true }) currentPlayerRole!: Role;
  @Prop({ default: 5 }) maxPlayers!: number;
}
</script>
