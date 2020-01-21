<template>
  <div class="container-events">
    <div class="events-row">
      <div class="info">
        <div class="topbar">
          <p>Event {{ eventNumber }}</p>
        </div>
        <div class="content">
          <div class="name-wrapper">
            <p>Name</p>
            <p class="name">{{ currentEventName }}</p>
          </div>
          <div class="effect-wrapper">
            <p>Effect</p>
            <p class="effect">
              {{
                currentEventEffect !== ''
                  ? currentEventEffect
                  : 'No special effect'
              }}
            </p>
          </div>
        </div>
      </div>
      <div class="actions">
        <div class="outer-wrapper">
          <EventContainer :event="currentEvent" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { MarsEventData, EventClientView } from 'shared/types';
import EventContainer from '@/components/gamedashboard/bottom/events/EventContainer.vue';

@Component({
  components: {
    EventContainer
  }
})
export default class ContainerEvents extends Vue {
  get currentEvent(): MarsEventData {
    const current = this.$store.getters.currentEvent;

    // TODO: Move code elsewhere?
    const data = { id: current.id, visibility: true };
    this.$store.commit('SET_EVENT_VISIBILITY', data);

    return current;
  }

  get eventNumber(): number {
    const eventNumber = this.$tstore.state.marsEventsProcessed + 1;
    return eventNumber;
  }

  get currentEventName(): string {
    const name = this.currentEvent.name;
    if (name) {
      return name;
    }
    return '';
  }

  get currentEventEffect(): string {
    const effect = this.currentEvent.effect;
    if (effect) {
      return effect;
    }
    return '';
  }

  // get currentEventView(): EventClientView {
  //   const view = this.currentEvent.clientViewHandler;
  //   if(view) {
  //     return view;
  //   }
  //   return 'NO_CHANGE';
  // }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/containers/ContainerEvents.scss';
</style>
