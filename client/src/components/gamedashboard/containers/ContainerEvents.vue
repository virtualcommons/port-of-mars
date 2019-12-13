<template>
  <BContainer class="container-events" cols="12">
    <BRow class="row-events">
      <BCol class="events-info" cols="3">
        <BRow class="events-info-topbar">
          <p>Event</p>
        </BRow>
        <BRow class="events-info-content">
          <p class="events-info-content-name">{{ eventContentName }}</p>
          <p class="events-info-content-effect">{{ eventContentEffect }}</p>
        </BRow>
      </BCol>
      <BCol class="events-actions">
        <EventView />
      </BCol>
    </BRow>
  </BContainer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';

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
    switch(this.$tstore.state.eventView) {
      case 'EVENT_TEST':
        return 'EventTest';
      default:
        break;
    }
  }
}
</script>

<style scoped>
.container-events {
  height: 100%;
  width: 100%;
  max-width: none;
  padding: 0.5rem;
  margin: 0;
  color: var(--space-white);
  /* border: 0.125rem solid var(--space-white-opaque-2); */
}

.row-events {
  height: 100%;
  width: 100%;
  max-width: none;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* INFO */

.events-info {
  height: 100%;
  padding: 0;
  margin-right: 0.5rem;
  display: flex;
  flex-direction: column;
}

.events-info-topbar {
  height: 10%;
  width: 100%;
  margin: 0;
  margin-bottom: 0.5rem;
  padding: 0.25rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--space-white);
}

.events-info-topbar p {
  margin: 0;
  color: var(--space-gray);
  font-size: var(--font-medium);
}

.events-info-content {
  flex-grow: 1;
  width: 100%;
  padding: 0.5rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--space-white-opaque-1);
}

.events-info-content p {
  margin: 0.5rem 0;
  text-align: center;
}

.events-info-content-name {
  font-size: var(--font-med);
  color: var(--space-orange);
}

.events-info-content-effect {
  font-size: var(--font-small);
}

/* ACTIONS */

.events-actions {
  height: 100%;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--space-white-opaque-1);
}

.events-actions p {
  border-bottom: 0.125rem solid var(--space-orange);
  margin: 0;
}
</style>
