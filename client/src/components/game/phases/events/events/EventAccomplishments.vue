<template>
  <component :is="eventAccomplishmentsView"></component>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import AccomplishmentsSelectPurchased from "./views/AccomplishmentsSelectPurchased.vue";

@Component({
  components: {
    AccomplishmentsSelectPurchased
  }
})
export default class EventAccomplishments extends Vue {
  @Prop({ default: "" }) eventView!: string;

  get eventAccomplishmentsView(): string {
    switch (this.eventView) {
      case "ACCOMPLISHMENT_SELECT_PURCHASED":
        return "AccomplishmentsSelectPurchased";
      default:
        return "";
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@port-of-mars/client/stylesheets/game/phases/events/events/EventAccomplishments.scss";
</style>
