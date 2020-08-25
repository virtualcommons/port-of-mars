<template>
  <b-container class="w-100 p-0 m-0">
    <!-- button to switch between HUD Left Views -->
    <b-row class="w-100 h-100 p-0 m-0 justify-content-center align-items-center">

      <!-- view : other players -->
      <b-col cols="4" class="other-players">
        <button
          v-b-tooltip.hover.bottom="'Other Players'"
          @click="switchCurrentView(view.OtherPlayers)"
          :class="buttonClass(view.OtherPlayers)"
        >
          <b-icon-people-fill scale="1.5"></b-icon-people-fill>
        </button>
      </b-col>

      <!-- inventory -->
      <b-col cols="4" class="inventory">
        <button
          v-b-tooltip.hover.bottom="'Inventory'"
          @click="switchCurrentView(view.Inventory)"
          :class="buttonClass(view.Inventory)"
        >
          <b-icon-briefcase-fill scale="1.5"></b-icon-briefcase-fill>
        </button>
      </b-col>

      <!-- accomplishments -->
      <b-col cols="4" class="accomplishments">
        <button
          v-b-tooltip.hover.bottom="'Accomplishments'"
          @click="switchCurrentView(view.Accomplishments)"
          :class="buttonClass(view.Accomplishments)"
        >
          <b-icon-star-fill scale="1.5"></b-icon-star-fill>
        </button>
      </b-col>
    </b-row>
  </b-container>
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
@import '@port-of-mars/client/stylesheets/game/HUDLeftButtons.scss';
</style>
