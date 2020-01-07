<template>
  <div class="event-view">
    <div v-if="layout === 'NO_CHANGE'" class="event-no-change">
      <p>Nothing to see here!</p>
    </div>
    <component v-else-if="layout !== 'NO_CHANGE'" :is="eventView" :eventView="layout"></component>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import EventVote from '@/components/gamedashboard/bottom/events/EventVote.vue';
import EventInfluences from '@/components/gamedashboard/bottom/events/EventInfluences.vue';
import EventAccomplishments from '@/components/gamedashboard/bottom/events/EventAccomplishments.vue';

@Component({
  components: {
    EventVote,
    EventInfluences,
    EventAccomplishments
  }
})
export default class EventContainer extends Vue {
  private eventVoteViews: Array<string> = [
    'VOTE_YES_NO',
    'VOTE_FOR_PLAYER_SINGLE',
    'VOTE_FOR_PLAYER_HERO_PARIAH'
  ];
  private eventInfluencesViews: Array<string> = ['INFLUENCES_SELECT', 'INFLUENCES_DRAW'];
  private eventAccomplishmentsViews: Array<string> = ['ACCOMPLISHMENT_SELECT_PURCHASED'];

  get layout() {
    return this.$tstore.state.eventView;
  }

  get eventView(): string {
    // TODO: AUDIT
    // TODO: DISABLE_CHAT
    // TODO: Complete ACCOMPLISHMENT_SELECT_PURCHASED

    if (this.eventVoteViews.includes(this.layout)) {
      return 'EventVote';
    } else if (this.eventInfluencesViews.includes(this.layout)) {
      return 'EventInfluences';
    } else if (this.eventAccomplishmentsViews.includes(this.layout)) {
      return 'EventAccomplishments';
    }
    return '';
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/events/EventContainer.scss';
</style>
