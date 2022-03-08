<template>
  <b-container fluid class="h-100" style="color: var(--light-shade)">
    <b-row align-v="center" align-h="center" class="h-100 w-100">
      <component :is="eventView" :eventView="layout"></component>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { MarsEventData, EventClientView } from "@port-of-mars/shared/types";
import EventVote from "./EventVote.vue";
import EventInfluences from "./EventInfluences.vue";
import EventAccomplishments from "./EventAccomplishments.vue";
import EventNoChange from "./EventNoChange.vue";

@Component({
  components: {
    EventVote,
    EventInfluences,
    EventAccomplishments,
    EventNoChange
  }
})
export default class EventContainer extends Vue {
  @Prop() event!: MarsEventData;

  eventVoteViews: Array<EventClientView> = [
    "VOTE_YES_NO",
    "VOTE_PLAYER",
    "VOTE_HERO_PARIAH"
  ];
  eventInfluencesViews: Array<EventClientView> = ["INFLUENCES_SELECT", "INFLUENCES_DRAW"];
  eventAccomplishmentsViews: Array<EventClientView> = ["ACCOMPLISHMENT_SELECT_PURCHASED"];
  eventNoChangeViews: Array<EventClientView> = ["NO_CHANGE", "AUDIT", "DISABLE_CHAT"];

  get layout() {
    return this.event.clientViewHandler;
  }

  get eventView(): string {
    // TODO: NO_CHANGE VIEW (MAYBE)
    if (this.eventVoteViews.includes(this.layout)) {
      return "EventVote";
    } else if (this.eventInfluencesViews.includes(this.layout)) {
      return "EventInfluences";
    } else if (this.eventAccomplishmentsViews.includes(this.layout)) {
      return "EventAccomplishments";
    } else if (this.eventNoChangeViews.includes(this.layout)) {
      return "EventNoChange";
    }
    return "";
  }
}
</script>
