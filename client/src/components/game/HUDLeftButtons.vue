<template>
  <div class="c-hud-left-buttons container">
    <div class="button-switchers row">
      <div class="other-players col-4">
        <button
          v-b-tooltip.hover.bottom="'Other Players'"
          @click="switchCurrentView(view.OtherPlayers)"
          :class="buttonClass(view.OtherPlayers)"
        >
          <font-awesome-icon :icon="['fas', 'users']" size="lg" class="icon" />
        </button>
      </div>
      <div class="inventory col-4">
        <button
          v-b-tooltip.hover.bottom="'Inventory'"
          @click="switchCurrentView(view.Inventory)"
          :class="buttonClass(view.Inventory)"
        >
          <font-awesome-icon
            :icon="['fas', 'briefcase']"
            size="lg"
            class="icon"
          />
        </button>
      </div>
      <div class="accomplishments col-4">
        <button
          v-b-tooltip.hover.bottom="'Accomplishments'"
          @click="switchCurrentView(view.Accomplishments)"
          :class="buttonClass(view.Accomplishments)"
        >
          <font-awesome-icon :icon="['fas', 'star']" size="lg" class="icon" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator';

import { GameRequestAPI } from '@port-of-mars/client/api/game/request';
import { HUDLeftView } from '@port-of-mars/shared/game/client/panes';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons/faBriefcase';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faUsers, faBriefcase, faStar);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({})
export default class HUDLeftButtons extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  get view() {
    return HUDLeftView;
  }

  get currentView() {
    return this.$tstore.state.userInterface.hudLeftView;
  }

  private switchCurrentView(view: HUDLeftView) {
    this.api.setHUDLeftView(view);
  }

  private buttonClass(buttonViewOption: HUDLeftView) {
    return buttonViewOption === this.currentView ? 'selected' : '';
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/HUDLeftButtons.scss';
</style>
