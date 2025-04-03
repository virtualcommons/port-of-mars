<template>
  <div>
    <div
      v-for="e in events"
      :key="e.id"
      class="mb-2"
      style="background-color: var(--dark-shade)"
      :ref="e.inPlay ? 'activeCard' : ''"
    >
      <EventCard :event="e" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import EventCard from "@port-of-mars/client/components/lite/EventCard.vue";
import { EventCardData } from "@port-of-mars/shared/sologame";

@Component({
  components: {
    EventCard,
  },
})
export default class Deck extends Vue {
  @Prop() events!: EventCardData[];

  @Watch("events", { deep: true })
  onEventsChanged() {
    const activeCard = this.events.find(e => e.inPlay);
    if (activeCard) {
      this.$nextTick(() => {
        const ref = this.$refs.activeCard as HTMLElement[];
        if (ref && ref[0]) {
          this.$emit("active-card-changed", ref[0]);
        }
      });
    }
  }
}
</script>

<style lang="scss"></style>
