<template>
  <div class="user-header">
    <p
      @click="logoutUser"
      @mouseover="handleHover(true)"
      @mouseleave="handleHover(false)"
    >
      <span>{{ prependedText }}</span
      >{{ username }}
    </p>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class UserHeader extends Vue {
  private prependedText: string = 'Logged in as ';

  mounted() {
    const jwt = this.$ajax.loginCreds?.token;
    if (!jwt) {
      console.log('No user token found. Redirecting to Login...');
      this.$router.push({ name: 'Login' });
    }
    // TODO: Get data from token if refreshed (?)
  }

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
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/global/UserHeader.scss';
</style>
