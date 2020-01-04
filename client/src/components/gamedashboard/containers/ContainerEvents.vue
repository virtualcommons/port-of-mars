<template>
  <div class="container-events">
    <div class="events-row">
      <div class="info">
        <div class="topbar">
          <p>Event</p>
        </div>
        <div class="content">
          <p class="name">{{ eventContentName }}</p>
          <p class="effect">{{ eventContentEffect }}</p>
        </div>
      </div>
      <div class="actions">
        <EventView />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import EventView from '@/components/gamedashboard/events/EventView.vue';

@Component({
  components: {
    EventView
  }
})
export default class ContainerEvents extends Vue {
  private eventContentName: string = 'Out of Commission';

  private eventContentEffect: string = 'The Politician receives only 3 Time Blocks this round.';

  get layout() {
    console.log(`(${typeof this.$tstore.state.eventView}): ${this.$tstore.state.eventView}`);
    switch (this.$tstore.state.eventView) {
      case 'EVENT_TEST':
        return 'EventTest';
      default:
        break;
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/containers/ContainerEvents.scss';
</style>
