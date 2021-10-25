<template>
  <b-row class="h-100 w-100 m-0 p-0">
    <b-col class="h-100 w-100" cols="6">
      <HUDLeft></HUDLeft>
    </b-col>
    <b-col class="h-100 w-100" cols="6">
      <HUDRight></HUDRight>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Vue, Component, Inject } from "vue-property-decorator";
import HUDLeft from "@port-of-mars/client/components/game/HUDLeft.vue";
import HUDRight from "@port-of-mars/client/components/game/HUDRight.vue";

@Component({
  components: {
    HUDLeft,
    HUDRight
  }
})
export default class HUD extends Vue {}
</script>

<style lang="scss" scoped>
.left {
  border-left: 0.2rem solid $light-shade-25;
  border-right: 0.2rem solid $light-shade-25;
}

.right {
  border-right: 0.2rem solid $light-shade-25;
}
</style>
