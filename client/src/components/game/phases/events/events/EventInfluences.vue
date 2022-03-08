<template>
  <component :is="eventInvestmentsView"></component>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import SelectResource from "@port-of-mars/client/components/game/phases/events/views/InfluencesSelect.vue";
import DrawResource from "@port-of-mars/client/components/game/phases/events/views/DrawResource.vue";

@Component({
  components: {
    SelectResource,
    DrawResource,
  }
})
export default class EventInfluences extends Vue {
  @Prop({ default: "" }) eventView!: string;

  get eventInvestmentsView(): string {
    switch (this.eventView) {
      case "SELECT_RESOURCE":
        return "SelectResource";
      case "DRAW_RESOURCE":
        return "DrawResource";
      default:
        return "";
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@port-of-mars/client/stylesheets/game/phases/events/events/EventInfluences.scss";
</style>
