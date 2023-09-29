<template>
  <div class="content-container p-2" :class="{ 'bg-success': event.inPlay }">
    <h4>{{ event.displayName }}</h4>
    <p>
      <small
        ><i>{{ event.flavorText }}</i></small
      >
    </p>
    <b-badge variant="danger" v-if="event.expired">expired</b-badge>
    <p class="mb-0">{{ event.effectText }}</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { EventCardData } from "@port-of-mars/shared/sologame";

@Component({})
export default class EventCard extends Vue {
  @Prop() event!: EventCardData;
}
</script>

<style lang="scss"></style>
