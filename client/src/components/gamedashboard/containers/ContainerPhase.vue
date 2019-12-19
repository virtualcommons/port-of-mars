<template>
  <BContainer class="container-phase">
    <BRow class="row-phase">
      <BCol class="phase" cols="3">
        <Phase class="v-step-3" />
      </BCol>
      <BCol id="hscroll" class="events-container" cols="6">
        <div class="events-container-outer">
          <p class="events-container-topbar">Events</p>
          <div class="events-container-inner">
            <div class="events">
              <!-- need to refactor key -->
              <p class="events-empty" v-if="eventsForTheRound.length === 0">No Active Events</p>
              <CardEvent
                v-for="eventItem in eventsForTheRound"
                :event="eventItem"
                :key="Math.random()"
              />
            </div>
          </div>
        </div>
      </BCol>
      <BCol cols="3" class="mars-mars">
        <MarsLog />
      </BCol>
    </BRow>
  </BContainer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';
import Phase from '@/components/gamedashboard/Phase.vue';
import CardEvent from '@/components/gamedashboard/cards/CardEvent.vue';
import MarsLog from '@/components/gamedashboard/MarsLog.vue';

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
    Phase,
    CardEvent,
    MarsLog
  }
})
export default class ContainerPhase extends Vue {
  mounted() {
    document.getElementById('hscroll').addEventListener('wheel', this.handleScroll);
  }

  beforeDestroy() {
    document.getElementById('hscroll').removeEventListener('wheel', this.handleScroll);
  }

  handleScroll(e) {
    if (e.deltaY > 0 && e.deltaX === 0) {
      document.getElementById('hscroll').scrollLeft += 37.5;
    } else if (e.deltaY < 0 && e.deltaX === 0) {
      document.getElementById('hscroll').scrollLeft -= 37.5;
    }
  }

  get eventsForTheRound() {
    return this.$tstore.state.marsEvents;
  }
}
</script>

<style scoped>
.container-phase {
  height: 85%;
  width: 100%;
  max-width: none;
  padding: 0;
  /* border: 0.125rem solid var(--space-white-opaque-2); */
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.row-phase {
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
}

.phase {
  height: 100%;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  /* border: 0.125rem solid var(--space-white-opaque-2); */
  /* background-color: pink; */
}

.events-container {
  height: 100%;
  padding: 0;
  /* padding: 0.5rem 0; */
  /* border: 0.125rem solid var(--space-white-opaque-2); */
  /* border: 0.125rem solid red; */
  /* background-color: green; */
}

.events-container-outer {
  height: 100%;
  padding: 0.5rem;
  /* border: 0.125rem solid var(--space-white-opaque-2); */
  display: flex;
  flex-flow: column;
}

.events-container-topbar {
  padding: 0.5rem;
  border-bottom: 0.125rem solid var(--space-white-opaque-2);
  margin-bottom: 0.5rem;
  font-size: var(--font-med);
  text-align: center;
  color: var(--space-white-opaque-2);
  /* background-color: var(--space-orange); */
  background-color: transparent;
}

.events-container-inner {
  flex-grow: 1;
  width: 100%;
  padding: 0 0.5rem;
  display: flex;
  justify-content: center;
  background-color: var(--space-white-opaque-1);
}

.events {
  height: 100%;
  width: auto;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  overflow-x: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

.events::-webkit-scrollbar {
  /* WebKit */
  height: 0;
  width: 0;
}

.events-empty {
  margin-bottom: 0;
  font-size: var(--font-med);
  text-align: center;
  color: var(--space-white-opaque-2);
}

.mars-mars {
  height: 100%;
  padding: 0.5rem;
  /* background-color: green; */
  /* border: 0.125rem solid red; */
  /* background-color: blue; */
}
</style>
