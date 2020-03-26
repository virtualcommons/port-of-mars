<template>
  <div class="c-activeeventspopup" :style="position">
    <button @click="toggle" class="toggle">
      <span>Active Events</span>
      <font-awesome-icon
        v-if="!visible"
        :icon="['fas', 'caret-up']"
        size="lg"
      />
      <font-awesome-icon
        v-if="visible"
        :icon="['fas', 'caret-down']"
        size="lg"
      />
    </button>
    <div class="wrapper"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faCaretUp);
library.add(faCaretDown);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
  components: {}
})
export default class ActiveEventsPopup extends Vue {
  private visible: boolean = false;

  private toggle() {
    this.visible = !this.visible;
  }

  get position() {
    return this.visible ? { bottom: '0rem' } : { bottom: '-45rem' };
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/global/ActiveEventsPopup.scss';
</style>
