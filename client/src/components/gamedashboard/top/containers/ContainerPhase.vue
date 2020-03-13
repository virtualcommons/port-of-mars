import {Phase} from "@port-of-mars/shared/types";
<template>
  <div class="container-phase">
    <div class="phase-row">
      <div class="phase">
        <Phase class="tour-phase" />
      </div>
      <div class="events-container tour-events-overview">
        <div class="outer">
          <p class="topbar">Events</p>
          <div class="inner">
            <div id="hscroll" class="events">
              <p class="empty" v-if="eventsForTheRound.length === 0">
                No Active Events
              </p>
              <CardEvent
                v-for="(event, eventInd) in eventsForTheRound"
                :event="event"
                :visible="visible(eventInd)" :key="eventInd"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="marslog-container">
        <MarsLog />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import Phase from '@port-of-mars/client/components/gamedashboard/top/Phase.vue';
  import CardEvent from '@port-of-mars/client/components/gamedashboard/global/cards/CardEvent.vue';
  import MarsLog from '@port-of-mars/client/components/gamedashboard/top/MarsLog.vue';
  import * as shared from '@port-of-mars/shared/types'

  @Component({
  components: {
    Phase,
    CardEvent,
    MarsLog
  }
})
export default class ContainerPhase extends Vue {
  mounted() {
    let scrollElement = document.getElementById('hscroll');
    if (scrollElement) {
      scrollElement.addEventListener('wheel', this.handleScroll);
    }
  }

  get eventsProcessed(): number {
    return this.$tstore.state.marsEventsProcessed;
  }

  visible(ind: number) {
    return this.$tstore.state.phase !== shared.Phase.events || ind <= this.eventsProcessed;
  }

  handleScroll(e: WheelEvent) {
    if (e.deltaY > 0 && e.deltaX === 0) {
      document.getElementById('hscroll')!.scrollLeft += 37.5;
    } else if (e.deltaY < 0 && e.deltaX === 0) {
      document.getElementById('hscroll')!.scrollLeft -= 37.5;
    }
  }

  get eventsForTheRound() {
    return this.$tstore.state.marsEvents;
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/top/containers/ContainerPhase.scss';
</style>
