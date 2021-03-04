<template>
  <b-row class="h-100 w-100 justify-content-center mx-0 my-2 p-0">
      <b-col class="p-0" cols="3">
        <button
          v-b-tooltip.hover.top="'Phase Information'"
          :class="buttonClass(view.PhaseInformation)"
          @click="switchCurrentView(view.PhaseInformation)"
        >
          <font-awesome-icon :icon="['fas', 'info']" class="icon" size="lg"/>
        </button>
      </b-col>
      <b-col class="justify-content-center align-items-center" cols="3">
        <button
          v-b-tooltip.hover.top="'Active Events'"
          :class="buttonClass(view.ActiveEvents)"
          @click="switchCurrentView(view.ActiveEvents)"
        >
          <font-awesome-icon :icon="['fas', 'meteor']" class="icon" size="lg"/>
        </button>
      </b-col>
  </b-row>
</template>

<script lang="ts">
import {Vue, Component, Inject} from 'vue-property-decorator';

import {GameRequestAPI} from '@port-of-mars/client/api/game/request';
import {HUDRightView} from '@port-of-mars/shared/game/client/panes';

import {library} from '@fortawesome/fontawesome-svg-core';
import {faMeteor} from '@fortawesome/free-solid-svg-icons/faMeteor';
import {faInfo} from '@fortawesome/free-solid-svg-icons/faInfo';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

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

  .icon {
    height: 50%;
    width: 50%;
    color: $light-shade;
  }
}
</style>
