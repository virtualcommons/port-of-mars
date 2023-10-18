<template>
  <b-modal
    v-model="localVisible"
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
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
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

  localVisible = false;

  created() {
    this.localVisible = this.visible;
    window.addEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === " ") {
      this.$emit("continue");
    }
  }

  // avoid mutating visible directly
  @Watch("visible")
  onVisibleChanged(newVal: boolean) {
    this.localVisible = newVal;
  }

  // briefly close the modal when the event changes to show the transition
  @Watch("event.deckCardId")
  async onDeckCardIdChanged() {
    this.localVisible = false;
    await this.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 300));
    this.localVisible = true;
  }
}
</script>

<style lang="scss"></style>
