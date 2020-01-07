<template>
  <component :is="eventVoteView"></component>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import VoteYesNo from '@/components/gamedashboard/bottom/events/views/VoteYesNo.vue';
import VoteForPlayerSingle from '@/components/gamedashboard/bottom/events/views/VoteForPlayerSingle.vue';
import VoteForPlayerHeroPariah from '@/components/gamedashboard/bottom/events/views/VoteForPlayerHeroPariah.vue';

@Component({
  components: {
    VoteYesNo,
    VoteForPlayerSingle,
    VoteForPlayerHeroPariah
  }
})
export default class EventVote extends Vue {
  @Prop({ default: '' }) private eventView!: string;

  get eventVoteView(): string {
    switch (this.eventView) {
      case 'VOTE_YES_NO':
        return 'VoteYesNo';
      case 'VOTE_FOR_PLAYER_SINGLE':
        return 'VoteForPlayerSingle';
      case 'VOTE_FOR_PLAYER_HERO_PARIAH':
        return 'VoteForPlayerHeroPariah';
      default:
        return '';
    }
    return '';
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/events/EventVote.scss';
</style>
