<template>
  <b-row class="justify-content-center w-100 my-2 p-0">
    <b-col class="p-0" cols="3">
      <button
        v-b-tooltip.hover.top="'Phase Information'"
        :class="buttonClass(view.PhaseInformation)"
        class="hud-button"
        @click="switchCurrentView(view.PhaseInformation)"
      >
        <b-icon-info-lg scale="1.5"></b-icon-info-lg>
      </button>
    </b-col>
    <b-col cols="3">
      <button
        v-b-tooltip.hover.top="'Active Events'"
        :class="buttonClass(view.ActiveEvents)"
        class="hud-button"
        @click="switchCurrentView(view.ActiveEvents)"
      >
        <b-icon-cloud-lightning-rain scale="1.5"></b-icon-cloud-lightning-rain>
      </button>
    </b-col>
    <b-col cols="3">
      <b-button
        class="hud-button"
        v-b-tooltip.hover.top="'Game Manual'"
        :to="manual"
        target="_blank"
      >
        <b-icon-question-lg scale="1.2" shift-v="-5"></b-icon-question-lg>
      </b-button>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Vue, Component, Inject } from "vue-property-decorator";
import { GameRequestAPI } from "@port-of-mars/client/api/game/request";
import { HUDRightView } from "@port-of-mars/shared/game/client/panes";
import { MANUAL_PAGE } from "@port-of-mars/shared/routes";

@Component({})
export default class HUDRightButtons extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  get manual() {
    return { name: MANUAL_PAGE };
  }

  get view() {
    return HUDRightView;
  }

  get currentView() {
    return this.$tstore.state.userInterface.hudRightView;
  }

  switchCurrentView(view: HUDRightView) {
    this.api.setHUDRightView(view);
  }

  buttonClass(buttonViewOption: HUDRightView) {
    return buttonViewOption === this.currentView ? "selected" : "";
  }
}
</script>

<style lang="scss" scoped>
.hud-button {
  @include reset-button;
  height: 3rem;
  width: 3rem;
  @include reset-padding-margin;
  border-radius: 50%;
  font-size: $font-med;
  font-weight: $bold !important;
  text-align: center;
  color: $light-shade;
  border: 0.125rem solid $light-shade;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;

  &:disabled {
    opacity: 0.5;
  }

  &.selected {
    color: $dark-shade;
    background-color: $light-shade;
  }
}
</style>
