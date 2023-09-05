<template>
  <div class="content-container p-2">
    <h4>{{ event.displayName }}</h4>
    <p>
      <small
        ><i>{{ event.flavorText }}</i></small
      >
    </p>
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
