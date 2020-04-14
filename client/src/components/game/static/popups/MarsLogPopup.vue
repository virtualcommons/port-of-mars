<template>
  <div class="c-marslogpopup" :style="position">
    <BButton @click="toggle" class="toggle">
      <span>Mars Log</span>
      <font-awesome-icon
        v-if="!popupVisible"
        :icon="['fas', 'caret-up']"
        size="lg"
      />
      <font-awesome-icon
        v-if="popupVisible"
        :icon="['fas', 'caret-down']"
        size="lg"
      />
    </BButton>
    <div class="wrapper">
      <MarsLog />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { BButton } from 'bootstrap-vue';
import MarsLog from '@port-of-mars/client/components/game/MarsLog.vue';

library.add(faCaretUp);
library.add(faCaretDown);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
  components: {
    BButton,
    MarsLog,
  },
})
export default class MarsLogPopup extends Vue {
  get popupVisible() {
    return this.$tstore.state.userInterface.popupView.marsLogVisible;
  }

  private toggle() {
    this.$tstore.commit('SET_MARS_LOG_POPUP_VISIBILITY', !this.popupVisible);
  }

  get position() {
    return this.popupVisible ? { bottom: '0rem' } : { bottom: '-45rem' };
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/static/popups/MarsLogPopup.scss';
</style>
