<template>
  <b-container fluid class="h-100 p-0 mx-0" style="border: none">
    <b-row align-v="center" class="w-100 mx-0 mt-2 p-0 text-center">
      <!-- Event name | Active event indicator -->
      <b-col>
        <h5 class="p-2 text-center" style="background-color: var(--light-shade); color: black">
          {{ modalData.name }}
        </h5>
        <b-badge v-if="showActiveIndicator" variant="success">
          Active
        </b-badge>
      </b-col>

      <div class="w-100"></div>

      <b-col class="w-100 pt-4 px-3 m-0 text-center">
        <p>{{ modalData.effect !== "" ? modalData.effect : "No special effect" }}</p>
        <p class="text-left">
          <i>{{ modalData.flavorText }}</i>
        </p>
      </b-col>

      <div class="w-100"></div>

      <b-col class="w-100 pt-1 m-0 text-center">
        <p>
          Duration:
          <template v-if="modalData.duration > 1">
            <b>{{ modalData.elapsed }}</b> of
          </template>
          <b>{{ modalData.duration }}</b> Round(s)
        </p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { MarsEventData } from "@port-of-mars/shared/types";

@Component
export default class EventModal extends Vue {
  @Prop() modalData: MarsEventData;
  @Prop() showActiveIndicator: boolean;
}
</script>

<style></style>
