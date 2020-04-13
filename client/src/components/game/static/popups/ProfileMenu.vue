<template>
  <div class="c-profilemenu tour-profile-menu" :style="position">
    <button @click="toggle" class="toggle">
      <font-awesome-icon v-if="!visible" :icon="['fas', 'caret-right']" size="lg" />
      <font-awesome-icon v-if="visible" :icon="['fas', 'caret-left']" size="lg" class="left" />
    </button>
    <div class="wrapper" v-show="visible">
      <p>Logged in as {{ username }}</p>
      <router-link :to="'dashboard'" class="link">
        <button>
          <font-awesome-icon :icon="['fas', 'user-circle']" size="sm" />
          <span>Your Dashboard</span>
        </button>
      </router-link>
      <button
        @click="enableDevtools"
        v-if="!devtoolsEnabled && isDevModeEnabled"
        class="link"
      >
        <font-awesome-icon :icon="['far', 'window-close']" size="sm" />
        <span>Enable DevTools</span>
      </button>
      <button
        @click="disableDevtools"
        v-if="devtoolsEnabled && isDevModeEnabled"
        class="link"
      >
        <font-awesome-icon :icon="['fas', 'terminal']" size="sm" />
        <span>Disable Devtools</span>
      </button>
      <button @click="logoutUser" class="link">
        <font-awesome-icon :icon="['fas', 'sign-out-alt']" size="sm" />
        <span>Log Out</span>
      </button>
      <a
        href="mailto:portmars@asu.edu?subject=[port-of-mars]  Issue Submission"
        target="_blank"
        class="link"
        ><font-awesome-icon :icon="['fas', 'exclamation-triangle']" size="sm" /><span
          >Report a Problem</span
        ></a
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Inject } from 'vue-property-decorator';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons/faCaretLeft';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons/faUserCircle';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { GameRequestAPI } from '@port-of-mars/client/api/game/request';
import { isDev, isStaging } from '@port-of-mars/shared/settings';
import { faTerminal } from '@fortawesome/free-solid-svg-icons/faTerminal';
import { faWindowClose } from '@fortawesome/free-regular-svg-icons/faWindowClose';

library.add(faCaretRight);
library.add(faCaretLeft);
library.add(faUserCircle);
library.add(faSignOutAlt);
library.add(faTerminal);
library.add(faWindowClose);
library.add(faExclamationTriangle);
Vue.component("font-awesome-icon", FontAwesomeIcon);

@Component({
  components: {}
})
export default class ProfileMenu extends Vue {
  @Inject() readonly api!: GameRequestAPI & TutorialAPI;

  private visible: boolean = false;
  devtoolsEnabled: boolean = false;

  get isInTutorial() {
    return this.$tstore.getters.layout === "tutorial";
  }

  tutorialValidation() {
    if (this.isInTutorial) {
      this.api.completedGeneralClick();
      this.api.resetGame
    }
  }

  private toggle() {
    this.visible = !this.visible;

    // this.tutorialValidation();
  }

  get position() {
    return this.visible ? { left: "0rem" } : { left: "-20rem" };
  }

  get username(): string {
    const username = this.$tstore.state.user.username;
    return username ? username : "Username";
  }

  private logoutUser(): void {
    this.$ajax.forgetLoginCreds();
    this.$router.push({ name: "Login" });
  }

  get isDevModeEnabled() {
    return isDev() || isStaging();
  }

  disableDevtools() {
    if (document && document.onkeydown) document.onkeydown = null;
    this.devtoolsEnabled = false;
  }

  enableDevtools() {
    document.onkeydown = this.onKeyDown;
    this.devtoolsEnabled = true;
  }

  toggleDevtools() {
    if (this.devtoolsEnabled) {
      this.disableDevtools();
    } else {
      this.enableDevtools();
    }
  }

  /**
   * Map keystrokes to commands linked to game functionality.
   * @param e Event that is triggered by keystroke.
   * r : go to next phase
   * q : reset game
   * . : toggle loading
   * m : generate Mars Log message
   * ] : generates server message
   *
   */
  onKeyDown(e: any) {
    switch (e.key) {
      case "r":
        this.api.setNextPhase();
        break;
      case "q":
        this.api.resetGame();
        break;
      case ".":
        this.$store.commit("TOGGLE_LOADING");
        break;
      default:
        break;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@port-of-mars/client/stylesheets/game/static/popups/ProfileMenu.scss";
</style>
