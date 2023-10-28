<template>
  <div class="c-profilemenu tour-profile-menu" :style="position">
    <button @click="toggle" class="toggle tour-profile-menu-toggle">
      <b-icon-caret-right-fill v-if="!profileMenuVisible" class="mt-1"></b-icon-caret-right-fill>
      <b-icon-caret-left-fill v-else class="left mt-1"></b-icon-caret-left-fill>
    </button>
    <div class="wrapper" v-show="profileMenuVisible">
      <p>Logged in as {{ username }}</p>
      <router-link :to="freePlayLobby" class="link">
        <button>
          <b-icon-person-fill></b-icon-person-fill>
          <span>Return to Lobby</span>
        </button>
      </router-link>
      <button @click="logoutUser" class="link">
        <b-icon-box-arrow-right></b-icon-box-arrow-right>
        <span>Log Out</span>
      </button>
      <a
        href="mailto:portmars@asu.edu?subject=[port-of-mars]  Issue Submission"
        target="_blank"
        class="link"
      >
        <b-icon-exclamation-triangle-fill></b-icon-exclamation-triangle-fill>
        <span>Report a Problem</span></a
      >
      <button @click="enableDevtools" v-if="!devtoolsEnabled && isDevModeEnabled" class="link">
        <b-icon-terminal></b-icon-terminal>
        <span>Enable DevTools</span>
      </button>
      <button @click="disableDevtools" v-if="devtoolsEnabled && isDevModeEnabled" class="link">
        <b-icon-x-square></b-icon-x-square>
        <span>Disable Devtools</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject } from "vue-property-decorator";
import { GameRequestAPI } from "@port-of-mars/client/api/game/request";
import { isDev, isStaging } from "@port-of-mars/shared/settings";
import { FREE_PLAY_LOBBY_PAGE } from "@port-of-mars/shared/routes";

@Component({
  components: {},
})
export default class ProfileMenu extends Vue {
  @Inject() readonly api!: GameRequestAPI;
  devtoolsEnabled: boolean = false;

  freePlayLobby = { name: FREE_PLAY_LOBBY_PAGE };

  get profileMenuVisible() {
    return this.$tstore.state.userInterface.profileMenuView.visible;
  }

  toggle() {
    this.api.toggleProfileMenu(this.profileMenuVisible);
  }

  get position() {
    return this.profileMenuVisible ? { left: "0rem" } : { left: "-20rem" };
  }

  get username(): string {
    const username = this.$tstore.state.user.username;
    return username ? username : "Username";
  }

  logoutUser(): void {
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
      default:
        break;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@port-of-mars/client/stylesheets/game/static/popups/ProfileMenu.scss";
</style>
