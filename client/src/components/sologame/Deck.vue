<template>
  <div>
    <div v-for="e in events" :key="e.id" class="mb-2"
    style="background-color: var(--dark-shade);"
    v-box-shadow="34"
    >
      <EventCard :event="e" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import EventCard from "@port-of-mars/client/components/sologame/EventCard.vue";
import { EventCardData } from "@port-of-mars/shared/sologame";

@Component({
  components: {
    EventCard,
  },
})
export default class Deck extends Vue {
  @Prop() events!: EventCardData[];
}
</script>

<style lang="scss"></style>
