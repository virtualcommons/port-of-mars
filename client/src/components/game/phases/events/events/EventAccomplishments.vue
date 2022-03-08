<template>
  <component :is="eventAccomplishmentsView"></component>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import SelectPurchasedAccomplishment from "@port-of-mars/client/components/game/phases/views/SelectPurchasedAccomplishment.vue";

@Component({
  components: {
    SelectPurchasedAccomplishment
  }
})
export default class EventAccomplishments extends Vue {
  @Prop({ default: "" }) eventView!: string;

  get eventAccomplishmentsView(): string {
    switch (this.eventView) {
      case "SELECT_PURCHASED_ACCOMPLISHMENT":
        return "SelectPurchasedAccomplishment";
      default:
        return "";
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@port-of-mars/client/stylesheets/game/phases/events/events/EventAccomplishments.scss";
</style>
