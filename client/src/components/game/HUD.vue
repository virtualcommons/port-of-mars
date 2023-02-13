<template>
  <b-container fluid class="h-100 m-0 p-0">
    <b-row class="h-100 w-100 m-0 p-0">
      <b-col class="h-100 w-100 m-0 p-0">
        <HUDLeft></HUDLeft>
      </b-col>
      <b-col class="h-100 w-100 m-0 p-0">
        <HUDRight></HUDRight>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import HUDLeft from "@port-of-mars/client/components/game/HUDLeft.vue";
import HUDRight from "@port-of-mars/client/components/game/HUDRight.vue";

@Component({
  components: {
    HUDLeft,
    HUDRight,
  },
})
export default class HUD extends Vue {}
</script>
