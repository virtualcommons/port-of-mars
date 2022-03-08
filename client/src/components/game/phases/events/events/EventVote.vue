<template>
  <component :is="eventVoteView"></component>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import VoteYesNo from "@port-of-mars/client/components/game/phases/events/views/VoteYesNo.vue";
import VotePlayer from "@port-of-mars/client/components/game/phases/events/views/VotePlayer.vue";
import VoteHeroPariah from "@port-of-mars/client/components/game/phases/events/views/VoteHeroPariah.vue";

@Component({
  components: {
    VoteYesNo,
    VotePlayer,
    VoteHeroPariah
  }
})
export default class EventVote extends Vue {
  @Prop({ default: "" }) eventView!: string;

  get eventVoteView(): string {
    switch (this.eventView) {
      case "VOTE_YES_NO":
        return "VoteYesNo";
      case "VOTE_PLAYER":
        return "VotePlayer";
      case "VOTE_HERO_PARIAH":
        return "VoteHeroPariah";
      default:
        return "";
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@port-of-mars/client/stylesheets/game/phases/events/events/EventVote.scss";
</style>
