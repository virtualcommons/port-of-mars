<template>
  <div class="event-no-change">
    <div class="wrapper">
      <p class="note">Note</p>
      <p class="event-text">{{ eventNoChangeText }}</p>
    </div>
    <button
      @click="handleContinue"
      class="animated pulse slower infinite"
      type="button"
      name="button"
    >
      Continue
    </button>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  Inject,
  InjectReactive
} from 'vue-property-decorator';
import { GameRequestAPI } from '@port-of-mars/client/api/game/request';

@Component({})
export default class EventNoChange extends Vue {
  @Inject() readonly api!: GameRequestAPI;
  @Prop({ default: '' }) private eventView!: string;

  get eventNoChangeText(): string {
    switch (this.eventView) {
      case 'NO_CHANGE':
        return 'This event requires no interaction.';
      case 'AUDIT':
        return 'Hover over a player in the Player Scores area to view an overview of their investment inventory.';
      case 'DISABLE_CHAT':
        return 'This event requires no interaction.';
      default:
        return 'This event requires no interaction.';
    }
  }

  private handleContinue(): void {
    console.log('EVENT (CONTINUE)');
    this.api.setPlayerReadiness(true);
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/GameDashboardPhases/phases/eventsPhase/events/EventNoChange.scss';
</style>
