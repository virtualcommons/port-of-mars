<template>
  <div class="user-header">
    <div class="problem">
      <button @click="openModalProblem">BETA: Report a Problem</button>
    </div>
    <div v-if="inDevelopment" class="switch">
      <p>Enable DevTools</p>
      <button
        @click="toggleDevTools(true)"
        :class="{ selected: devToolsEnabled }"
      >
        On
      </button>
      <button
        @click="toggleDevTools(false)"
        :class="{ selected: !devToolsEnabled }"
      >
        Off
      </button>
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

  mounted() {
    if (process.env.NODE_ENV != 'test') {
      const jwt = this.$ajax.loginCreds?.token;
      if (!jwt) {
        console.log('No user token found. Redirecting to Login...');
        this.$router.push({ name: 'Login' });
      }
    }
    // TODO: Get data from token if refreshed (?)
  }

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

  // NOTE :: TOGGLE DEV TOOLS

  get inDevelopment(): boolean {
    return this.$tstore.state.inDevelopment;
  }

  get devToolsEnabled(): boolean {
    return this.$tstore.state.devToolsEnabled;
  }

  private toggleDevTools(option: boolean): void {
    this.$store.commit('TOGGLE_DEV_TOOLS', option);
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/global/UserHeader.scss';
</style>
