<template>
  <div
    class="content-container p-2"
    :class="{ dim: event.expired, 'border-primary': event.inPlay, 'dim-slight': upcoming }"
  >
    <h6 :class="{ 'text-primary': event.inPlay }">{{ event.displayName }}</h6>
    <p class="mb-0">{{ event.effectText }}</p>
    <slot></slot>
    <p class="text-muted mt-2 mb-0" v-if="showFlavorText">
      <small
        ><small
          ><i>{{ event.flavorText }}</i></small
        ></small
      >
    </p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { EventCardData } from "@port-of-mars/shared/lite";

@Component({})
export default class EventCard extends Vue {
  @Prop() event!: EventCardData;
  @Prop({ default: true }) showFlavorText!: boolean;

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
