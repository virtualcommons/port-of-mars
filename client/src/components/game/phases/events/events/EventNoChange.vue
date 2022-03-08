<template>
  <b-row class="text-center" align-v="center" align-h="center">
    <b-col sm="12">
      <p class="event-instructions">Event</p>
      <p class="event-body text">{{ eventNoChangeText }}</p>
    </b-col>
    <b-col sm="12">
      <b-button @click="setReadiness" variant="outline-light" squared id="button">
        Continue
      </b-button>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Vue, Component, Prop, Inject } from "vue-property-decorator";
import { GameRequestAPI } from "@port-of-mars/client/api/game/request";

@Component({})
export default class EventNoChange extends Vue {
  @Inject() readonly api!: GameRequestAPI;
  @Prop({ default: "" }) eventView!: string;

  get eventNoChangeText(): string {
    switch (this.eventView) {
      case "NO_CHANGE":
        return "This event requires no interaction.";
      case "AUDIT":
        return "Click a player in the Player Scores area to view an overview of their investment inventory.";
      case "DISABLE_CHAT":
        return "This event requires no interaction.";
      default:
        return "This event requires no interaction.";
    }
  }

  setReadiness(): void {
    console.log("EVENT (CONTINUE)");
    this.api.setPlayerReadiness(true);
  }
}
</script>
