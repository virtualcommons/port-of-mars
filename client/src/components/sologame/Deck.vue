<template>
  <div>
    <h4>{{ event.displayName }}</h4>
    <p><i>{{ event.flavorText }}</i></p>
    <p>{{ event.effectText }}</p>
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