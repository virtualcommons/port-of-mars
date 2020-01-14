import {EventClientView} from "shared/types";
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
        <EventContainer />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import EventContainer from '@/components/gamedashboard/bottom/events/EventContainer.vue';

@Component({
  components: {
    EventContainer
  }
})
export default class ContainerEvents extends Vue {
  private eventContentName: string = 'Out of Commission';

  private eventContentEffect: string = 'The Politician receives only 3 Time Blocks this round.';
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/containers/ContainerEvents.scss';
</style>
