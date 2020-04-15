p<template>
  <div class="c-activeeventspopup" :style="position">
    <button @click="toggle" class="toggle tour-event-popup">
      <span>Active Events</span>
      <font-awesome-icon
        v-if="!visible"
        :icon="['fas', 'caret-up']"
        size="lg"
      />
      <font-awesome-icon
        v-if="visible"
        :icon="['fas', 'caret-down']"
        size="lg"
      />
    </button>
    <div class="wrapper">
      <p class="empty" v-if="eventsForTheRound.length === 0">
        No Active Events
      </p>
      <EventCard
        v-for="(event, index) in eventsForTheRound"
        :key="index"
        :event="event"
        :visible="eventVisible(index)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import EventCard from '@port-of-mars/client/components/game/phases/events/EventCard.vue';
import { Phase } from '@port-of-mars/shared/types';

library.add(faCaretUp);
library.add(faCaretDown);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
  components: {
    EventCard,
  },
})
export default class ActiveEventsPopup extends Vue {
  private visible: boolean = false;

  private toggle() {
    this.visible = !this.visible;
  }

  get position() {
    return this.visible ? { bottom: '0rem' } : { bottom: '-45rem' };
  }

  get eventsForTheRound() {
    return this.$tstore.state.marsEvents;
  }

  get eventsProcessed(): number {
    return this.$tstore.state.marsEventsProcessed;
  }

  private eventVisible(index: number) {
    return (
      this.$tstore.state.phase !== Phase.events || index <= this.eventsProcessed
    );
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/static/popups/ActiveEventsPopup.scss';
</style>
