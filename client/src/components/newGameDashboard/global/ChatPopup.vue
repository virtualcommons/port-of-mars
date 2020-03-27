<template>
  <div class="c-chatpopup" :style="position">
    <BButton @click="toggle" class="toggle">
      <span>Chat</span>
      <BBadge variant="dark">10 <span class="sr-only">unread messages</span></BBadge>
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
    </BButton>
    <div class="wrapper">
      <NewChat />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { BBadge, BButton } from 'bootstrap-vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import NewChat from '@port-of-mars/client/components/newGameDashboard/right/NewChat.vue';
library.add(faCaretUp);
library.add(faCaretDown);
Vue.component('font-awesome-icon', FontAwesomeIcon);
@Component({
  components: {
    BBadge,
    BButton,
    NewChat
  }
})
export default class ChatPopup extends Vue {
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
@import '@port-of-mars/client/stylesheets/gamedashboard/global/ChatPopup.scss';
</style>