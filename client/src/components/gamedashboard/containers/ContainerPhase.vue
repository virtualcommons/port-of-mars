<template>
  <BContainer class="container-phase">
    <BRow class="row-phase">
      <BCol class="phase" cols="3">
        <Phase class="v-step-3 v-step-9 v-step-19" />
      </BCol>
      <BCol id="hscroll" class="events-container v-step-5" cols="9">
        <div class="events">
          <CardEvent v-for="event in eventsForTheRound" :key="event.name" :event="event"/>
        </div>
      </BCol>
    </BRow>
  </BContainer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';
import Phase from '@/components/gamedashboard/Phase.vue';
import CardEvent from '@/components/gamedashboard/cards/CardEvent.vue';

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
    Phase,
    CardEvent
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
  height: 100%;
  width: 100%;
  max-width: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.row-phase {
  height: 80%;
  width: 100%;
  padding: 0;
  margin: 0;
}

.phase {
  padding: 1rem 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.events-container {
  height: 100%;
  width: 100%;
  max-width: none;
  padding: 0;
  margin: 0;
  display: flex;
  overflow-x: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

.events-container::-webkit-scrollbar {
  /* WebKit */
  width: 0;
  height: 0;
}

.events {
  height: 100%;
  padding: 0 0.5rem;
  margin: 0;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
