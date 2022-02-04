<template>
  <b-container
    fluid
    :style="
      canPurchase
        ? 'border: 0.125rem solid var(--light-accent)'
        : 'border: 0.125rem solid var(--light-shade)'
    "
    style="background-color: var(--dark-shade); border: none"
    class="p-3 mx-0"
  >
    <!-- title -->
    <b-row align-v="center" class="w-100 mx-0 mt-2 p-0 text-center">
      <b-col>
        <h5
          :style="
            canPurchase
              ? 'backgroundColor: var(--light-accent)'
              : 'backgroundColor: var(--light-shade)'
          "
          class="p-2"
          style="color: black"
        >
          {{ modalData.label }}
        </h5>
      </b-col>

      <!-- Equal-width columns that span multiple lines: https://bootstrap-vue.org/docs/components/layout#comp-ref-b-col -->
      <div class="w-100"></div>

      <!-- information: points, description -->

      <!-- points -->
      <b-col
        class="d-flex flex-column justify-content-center align-items-center p-4 p-lg-4 mt-3"
        cols="3"
      >
        <p>{{ modalData.victoryPoints }} Points</p>
      </b-col>

      <!-- description -->
      <b-col class="pb-2 mt-3 text-left col-9">
        <p>{{ modalData.flavorText }}</p>
      </b-col>

      <div class="w-100"></div>

      <!-- cost -->
      <b-col
        class="d-flex flex-wrap w-100 m-0 pt-1 justify-content-center px-4 py-2"
        style="transition: all 0.15s ease-in-out;"
      >
        <div
          :class="investment.available ? '' : 'unattainable-resource'"
          class="cost justify-content-center align-items-center"
          v-for="investment in costToPurchase"
          :key="investment.name"
        >
          <img
            :src="require(`@port-of-mars/client/assets/icons/${investment.influence}.svg`)"
            :alt="investment.name"
          />
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { AccomplishmentData, Investment } from "@port-of-mars/shared/types";

@Component
export default class AccomplishmentModal extends Vue {
  @Prop({
    default: () => ({
      id: undefined,
      role: undefined,
      label: undefined,
      flavorText: undefined,
      science: undefined,
      government: undefined,
      legacy: undefined,
      finance: undefined,
      culture: undefined,
      systemHealth: undefined,
      victoryPoints: undefined,
      effect: undefined
    })
  })
  modalData!: AccomplishmentData;
  @Prop({ required: true }) costToPurchase!: { influence: Investment; available: boolean }[];
  @Prop({ default: false }) canPurchase!: boolean;
}
</script>

<style lang="scss">
.cost {
  height: 2rem;
  width: 2rem;
  padding: 0.25rem;
  border-radius: 50%;
  margin: 0.125rem;
  background-color: $light-shade;
}

.unattainable-resource {
  background-color: $light-shade-25 !important;
}
</style>
