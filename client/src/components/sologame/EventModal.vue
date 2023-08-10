<template>
  <b-modal
    v-model="visible"
    centered
    no-stacking
    hide-header
    hide-footer
    no-close-on-backdrop
    body-bg-variant="dark"
  >
    <EventCard :event="event"></EventCard>
    <b-button class="mt-2 w-100" variant="primary" @click="$emit('continue')">Continue</b-button>
  </b-modal>
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
export default class EventModal extends Vue {
  @Prop() event!: EventCardData;
  @Prop({ default: false }) visible!: boolean;
}
</script>

<style lang="scss"></style>
