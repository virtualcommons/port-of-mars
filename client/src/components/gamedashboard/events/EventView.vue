<template>
  <div class="event-test">
    <!-- NO_CHANGE -->
    <div v-if="layout === 'NO_CHANGE'" class="event-no-change">
      <p>Nothing to see here!</p>
    </div>

    <EventVote :eventView="layout" />
    <EventInvestments :eventView="layout" />
    <EventAccomplishments :eventView="layout" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import EventVote from '@/components/gamedashboard/events/EventVote.vue';
import EventInvestments from '@/components/gamedashboard/events/EventInvestments.vue';
import EventAccomplishments from '@/components/gamedashboard/events/EventAccomplishments.vue';

@Component({
  components: {
    EventVote,
    EventInvestments,
    EventAccomplishments
  }
})
export default class EventView extends Vue {
  get layout() {
    console.log(`(${typeof this.$tstore.state.eventView}): ${this.$tstore.state.eventView}`);
    return this.$tstore.state.eventView;
  }
}
</script>

<style scoped>
.event-test {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* NO_CHANGE */

.event-no-change {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--space-white);
}

.event-no-change p {
  margin: 0;
}
</style>
