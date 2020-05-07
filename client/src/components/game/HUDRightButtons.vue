<template>
  <div class="c-hud-right-buttons container">
    <div class="button-switchers row">
      <div class="inventory col-3">
        <button
          v-b-tooltip.hover.top="'Phase Information'"
          @click="switchCurrentView(view.PhaseInformation)"
          :class="buttonClass(view.PhaseInformation)"
        >
          <font-awesome-icon :icon="['fas', 'info']" size="lg" class="icon" />
        </button>
      </div>
      <div class="accomplishments col-3">
        <button
          v-b-tooltip.hover.top="'Active Events'"
          @click="switchCurrentView(view.ActiveEvents)"
          :class="buttonClass(view.ActiveEvents)"
        >
          <font-awesome-icon :icon="['fas', 'meteor']" size="lg" class="icon" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator';

import { GameRequestAPI } from '@port-of-mars/client/api/game/request';
import { HUDRightView } from '@port-of-mars/client/types/panes.ts';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faMeteor } from '@fortawesome/free-solid-svg-icons/faMeteor';
import { faInfo } from '@fortawesome/free-solid-svg-icons/faInfo';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faMeteor, faInfo);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({})
export default class HUDRightButtons extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  get view() {
    return HUDRightView;
  }

  get currentView() {
    return this.$tstore.state.userInterface.hudRightView;
  }

  private switchCurrentView(view: HUDRightView) {
    this.api.setHUDRightView(view);
  }

  private buttonClass(buttonViewOption: HUDRightView) {
    return buttonViewOption === this.currentView ? 'selected' : '';
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/HUDRightButtons.scss';
</style>
