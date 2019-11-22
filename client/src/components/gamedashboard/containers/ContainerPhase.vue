<template>
  <BContainer class="container-phase">
    <BRow class="row-phase">
      <BCol class="phase" cols="3">
        <Phase />
      </BCol>
      <BCol class="events" cols="9">
        <CardEvent :event="eventsForTheRound[0]"/>
        <CardEvent :event="eventsForTheRound[1]"/>
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
  height: 80%;
  width: 100%;
  max-width: none;
  padding: 0;
  margin:0;
}

.row-phase {
  height: 100%;
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
  /* padding: 0.5rem; */
  /* margin: 1rem 0; */
  /* border: 0.125rem solid var(--space-white-opaque-2); */
}

.events {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  /* background-color: var(--space-white-opaque-1); */
}
</style>
