<template>
  <component :is="eventInvestmentsView"></component>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import InfluencesSelect from "./views/InfluencesSelect.vue";
import InfluencesDraw from "./views/InfluencesDraw.vue";

@Component({
  components: {
    InfluencesSelect,
    InfluencesDraw,
  },
})
export default class EventInfluences extends Vue {
  @Prop({ default: "" }) eventView!: string;

  get eventInvestmentsView(): string {
    switch (this.eventView) {
      case "INFLUENCES_SELECT":
        return "InfluencesSelect";
      case "INFLUENCES_DRAW":
        return "InfluencesDraw";
      default:
        return "";
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@port-of-mars/client/stylesheets/game/phases/events/events/EventInfluences.scss";
</style>
