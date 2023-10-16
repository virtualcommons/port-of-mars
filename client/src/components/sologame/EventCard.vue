<template>
  <div
    class="content-container p-2"
    :class="{ dim: event.expired, 'border-primary': event.inPlay, 'dim-slight': upcoming }"
  >
    <h4 :class="{ 'text-primary': event.inPlay }">{{ event.displayName }}</h4>
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

  get upcoming() {
    return !this.event.inPlay && !this.event.expired;
  }
}
</script>

<style lang="scss" scoped>
.dim {
  opacity: 0.35;
}

.dim-slight {
  opacity: 0.75;
}
</style>
