<template>
  <div class="user-header">
    <div class="problem">
      <button @click="openModalProblem">[ <span>BETA</span> ] <span>Report a Problem</span></button>
    </div>
    <div class="logout">
      <button
        @click="logoutUser"
        @mouseover="handleHover(true)"
        @mouseleave="handleHover(false)"
      >
        <span>{{ prependedText }}</span
        >{{ username }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class UserHeader extends Vue {
  private prependedText: string = 'Logged in as ';

  // NOTE :: VIEW & LOGOUT USER

  get username(): string {
    return this.$tstore.state.user.username;
  }

  private handleHover(option: boolean): void {
    if (option) {
      this.prependedText = 'Logout ';
    } else {
      this.prependedText = 'Logged in as ';
    }
  }

  private logoutUser(): void {
    this.$ajax.forgetLoginCreds();
    // TODO: Fully handle re-routing
    this.$router.push({ name: 'Login' });
  }

  // NOTE :: SUBMIT ISSUE

  private openModalProblem(): void {
    this.$root.$emit('openModalProblem');
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/global/UserHeader.scss';
</style>
