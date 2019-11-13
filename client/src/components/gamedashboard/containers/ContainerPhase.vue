<template>
  <BContainer class="container-phase">
    <BRow class="row-phase">
      <BCol class="phase" cols="3">
        <!-- phase component -->
        <Phase />
      </BCol>
      <BCol class="events" cols="9">
        <!-- event card components (3) -->
        <CardEvent :event="eventsForTheRound[0]"/>
        <CardEvent :event="eventsForTheRound[1]" id="v-step-8"/>
        <CardEvent :event="eventsForTheRound[2]"/>
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
    CardEvent,
  },
})

export default class ContainerPhase extends Vue {
  get eventsForTheRound() {
    return this.$store.state.gameEvents;
  }
}
</script>

<style scoped>
.container-phase {
  width: 100%;
  height: 80%;
  max-width: none;
  padding: 0;
  margin:0;
  /* background-color: pink; */
}

.row-phase {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

.phase {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0.5rem;
  /* background-color: purple; */
}

.events {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 1rem 0.5rem;
  /* background-color: green; */
}
</style>
