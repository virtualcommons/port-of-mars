<template>
  <div class="c-profilemenu" :style="position">
    <button @click="toggle" class="toggle">
      <font-awesome-icon
        v-if="!visible"
        :icon="['fas', 'caret-right']"
        size="lg"
      />
      <font-awesome-icon
        v-if="visible"
        :icon="['fas', 'caret-left']"
        size="lg"
        class="left"
      />
    </button>
    <div class="wrapper" v-show="visible">
      <p>Logged in as {{ username }}</p>
      <router-link :to="'dashboard'" class="link">
        <button>
          <font-awesome-icon :icon="['fas', 'user-circle']" size="sm" /><span
            >Your Dashboard</span
          >
        </button>
      </router-link>
      <button @click="logoutUser" class="link">
        <font-awesome-icon :icon="['fas', 'sign-out-alt']" size="sm" /><span
          >Log Out</span
        >
      </button>
      <a
        href="mailto:portmars@asu.edu?subject=[port-of-mars]  Issue Submission"
        target="_blank"
        class="link"
        ><font-awesome-icon
          :icon="['fas', 'exclamation-triangle']"
          size="sm"
        /><span>Report a Problem</span></a
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons/faCaretLeft';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons/faUserCircle';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faCaretRight);
library.add(faCaretLeft);
library.add(faUserCircle);
library.add(faSignOutAlt);
library.add(faExclamationTriangle);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
  components: {},
})
export default class ProfileMenu extends Vue {
  private visible: boolean = false;

  private toggle() {
    this.visible = !this.visible;
  }

  get position() {
    return this.visible ? { left: '0rem' } : { left: '-20rem' };
  }

  get username(): string {
    const username = this.$tstore.state.user.username;
    return username ? username : 'Username';
  }

  private logoutUser(): void {
    this.$ajax.forgetLoginCreds();
    this.$router.push({ name: 'Login' });
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/static/popups/ProfileMenu.scss';
</style>
