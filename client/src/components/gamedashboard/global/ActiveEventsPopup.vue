<template>
  <div class="c-activeeventspopup" :style="position">
    <button @click="toggle" class="toggle">
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
<<<<<<< HEAD
    <div class="wrapper">
      <p class="empty" v-if="eventsForTheRound.length === 0">
        No Active Events
      </p>
      <NewCardEvent
        v-for="(event, index) in eventsForTheRound"
        v-show="eventVisible(index)"
        :event="event"
        :key="index"
      />
    </div>
=======
    <div class="wrapper"></div>
>>>>>>> feat: initial game board redesign work
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
<<<<<<< HEAD
import NewCardEvent from '@port-of-mars/client/components/gamedashboard/global/cards/NewCardEvent.vue';
import { Phase } from '@port-of-mars/shared/types';
=======
>>>>>>> feat: initial game board redesign work

library.add(faCaretUp);
library.add(faCaretDown);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
<<<<<<< HEAD
  components: {
    NewCardEvent
  }
=======
  components: {}
>>>>>>> feat: initial game board redesign work
})
export default class ActiveEventsPopup extends Vue {
  private visible: boolean = false;

  private toggle() {
    this.visible = !this.visible;
  }

  get position() {
    return this.visible ? { bottom: '0rem' } : { bottom: '-45rem' };
  }
<<<<<<< HEAD

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
=======
>>>>>>> feat: initial game board redesign work
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/global/ActiveEventsPopup.scss';
</style>
