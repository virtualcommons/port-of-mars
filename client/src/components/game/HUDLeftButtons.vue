<template>
  <b-row class="h-100 w-100 m-0 p-0 justify-content-center align-items-center">
    <!-- button to switch between HUD Left Views -->
    <!-- view : other players -->
    <b-col class="justify-content-center align-items-center" cols="4">
      <button
        v-b-tooltip.hover.bottom="'Other Players'"
        :class="buttonClass(view.OtherPlayers)"
        @click="switchCurrentView(view.OtherPlayers)"
      >
        <b-icon-people-fill scale="1.5"></b-icon-people-fill>
      </button>
    </b-col>

    <!-- inventory -->
    <b-col class="justify-content-center align-items-center" cols="4">
      <button
        v-b-tooltip.hover.bottom="'Inventory'"
        :class="buttonClass(view.Inventory)"
        @click="switchCurrentView(view.Inventory)"
      >
        <b-icon-briefcase-fill scale="1.5"></b-icon-briefcase-fill>
      </button>
    </b-col>

    <!-- accomplishments -->
    <b-col class="justify-content-center align-items-center" cols="4">
      <button
        v-b-tooltip.hover.bottom="'Accomplishments'"
        :class="buttonClass(view.Accomplishments)"
        @click="switchCurrentView(view.Accomplishments)"
      >
        <b-icon-star-fill scale="1.5"></b-icon-star-fill>
      </button>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import {Component, Inject, Vue} from 'vue-property-decorator';

import {GameRequestAPI} from '@port-of-mars/client/api/game/request';
import {HUDLeftView} from '@port-of-mars/shared/game/client/panes';
import {Phase} from "@port-of-mars/shared/types";

import {library} from '@fortawesome/fontawesome-svg-core';
import {faUsers} from '@fortawesome/free-solid-svg-icons/faUsers';
import {faBriefcase} from '@fortawesome/free-solid-svg-icons/faBriefcase';
import {faStar} from '@fortawesome/free-solid-svg-icons/faStar';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

library.add(faUsers, faBriefcase, faStar);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({})
export default class HUDLeftButtons extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  /**
   * The current phase of the game state.
   */
  get currentPhase() {
    return this.$tstore.state.phase;
  }

  /**
   * Phases: New Round, Events, Invest, Trade, Purchase, Discard
   */
  get phase() {
    return Phase;
  }

  /**
   * HUD Left View: OtherPlayers, Inventory, Accomplishments
   */
  get view() {
    return HUDLeftView;
  }

  /**
   * The current HUD Left View.
   * If the current phase is Trade,
   * autoset view to Accomplishments.
   */
  get currentView() {
    // if current phase = Trade
    // set HUDLeftView = Accomplishments
    // return the current state of HUDLeftView

    // if (this.currentPhase === this.phase.trade) {
    //   this.api.setHUDLeftView(this.view.Accomplishments);
    //   return this.$tstore.state.userInterface.hudLeftView;
    // }

    // else return the current state of HUDLeftView (determined by button click)
    return this.$tstore.state.userInterface.hudLeftView;
  }

  /**
   * Change the current HUD Left View.
   * @param view The type of view: OtherPlayers, Inventory, Accomplishments
   */
  private switchCurrentView(view: HUDLeftView): void {
    this.api.setHUDLeftView(view);
  }

  /**
   * Apply conditional styling on a selected button.
   * @param buttonViewOption The type of view: OtherPlayers, Inventory, Accomplishments
   * @return SCSS class to style a selected button.
   */
  private buttonClass(buttonViewOption: HUDLeftView): string {
    return buttonViewOption === this.currentView ? 'selected' : '';
  }
}
</script>

<style lang="scss" scoped>
button {
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

    .icon {
      color: $dark-shade;
    }
  }
}

.icon {
  height: 50%;
  width: 50%;
  color: $light-shade;
}
</style>
