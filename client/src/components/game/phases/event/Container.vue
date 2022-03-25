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
import EventVote from "@port-of-mars/client/components/game/phases/event/type/Vote.vue";
import EventInfluences from "@port-of-mars/client/components/game/phases/event/type/Resource.vue";
import EventAccomplishments from "@port-of-mars/client/components/game/phases/event/type/Accomplishment.vue";
import EventNoChange from "@port-of-mars/client/components/game/phases/event/type/NoChange.vue";

@Component({
  components: {
    EventVote,
    EventInfluences,
    EventAccomplishments,
    EventNoChange
  }
})
export default class Container extends Vue {
  @Prop() event!: MarsEventData;

  eventVoteViews: Array<EventClientView> = ["VOTE_YES_NO", "VOTE_PLAYER", "VOTE_HERO_PARIAH"];
  eventInfluencesViews: Array<EventClientView> = ["SELECT_RESOURCE", "DRAW_RESOURCE"];
  eventAccomplishmentsViews: Array<EventClientView> = ["SELECT_PURCHASED_ACCOMPLISHMENT"];
  eventNoChangeViews: Array<EventClientView> = ["NO_CHANGE", "AUDIT", "DISABLE_CHAT"];

  get layout() {
    return this.event.clientViewHandler;
  }

  get eventView(): string {
    // TODO: NO_CHANGE VIEW (MAYBE)
    if (this.eventVoteViews.includes(this.layout)) {
      return "Vote";
    } else if (this.eventInfluencesViews.includes(this.layout)) {
      return "Resource";
    } else if (this.eventAccomplishmentsViews.includes(this.layout)) {
      return "Accomplishment";
    } else if (this.eventNoChangeViews.includes(this.layout)) {
      return "NoChange";
    }
    return "";
  }
}
</script>
