<template>
  <div class="container-phase">
    <div class="phase-row">
      <div class="phase">
        <Phase class="v-step-3" />
      </div>
      <div class="events-container">
        <div class="outer">
          <p class="topbar">Events</p>
          <div class="inner">
            <div id="hscroll" class="events">
              <p class="empty" v-if="eventsForTheRound.length === 0">
                No Active Events
              </p>
              <CardEvent
                v-for="event in eventsForTheRound"
                :event="event"
                :key="event.id"
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
import { Vue, Component } from 'vue-property-decorator';
import Phase from '@/components/gamedashboard/top/Phase.vue';
import CardEvent from '@/components/gamedashboard/global/cards/CardEvent.vue';
import MarsLog from '@/components/gamedashboard/left/MarsLog.vue';

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
@import '@/stylesheets/gamedashboard/top/containers/ContainerPhase.scss';
</style>
