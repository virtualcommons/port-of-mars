<template>
  <div class="login">
    <div class="wrapper">
      <div class="text">
        <h1>Port of Mars</h1>
        <h2>Sign In</h2>
      </div>
      <div class="submit" v-if="isLoggedIn">
        <input type="button" @click="logout" :value="logoutText" />
      </div>
      <form class="login-form" v-else>
        <div class="input-username">
          <label for="username">ASURITE ID</label>
          <div class="input-wrapper">
            <input
              type="text"
              id="username"
              name="username"
              autocomplete="off"
              v-model="username"
            />
          </div>
        </div>
        <div class="submit">
          <input
            :disabled="submitDisabled"
            type="submit"
            @click="login"
            value="Login"
          />
        </div>
        <p class="error" v-if="error">
          {{ error }}
        </p>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import {DASHBOARD_PAGE, GAME_PAGE, LOBBY_PAGE, LOGIN_PAGE} from '@port-of-mars/shared/routes';
import {url} from "@port-of-mars/client/util";

@Component({})
export default class Login extends Vue {
  username: string = '';
  isLoggedIn: boolean = false;
  error: string = '';

  created() {
    this.isLoggedIn = !!this.$ajax.username;
  }

  get submitDisabled() {
    return !this.username;
  }

  get logoutText() {
    return `Logout (${this.$tstore.state.user.username})`;
  }

  logout() {
    this.$ajax.forgetLoginCreds();
    this.$ajax.forgetSubmissionId();
    this.isLoggedIn = false;
  }

  async login(e: Event) {
    e.preventDefault();
    const fd = new FormData((e as any).target.form);
    const data: any = { username: fd.get('username'), password: 'testing' };
    const response = await this.$ajax.post(this.loginUrl, data);
    await this.$ajax.setLoginCreds(response);
    if (response.status === 200) {
      this.$router.push({ name: DASHBOARD_PAGE });
    } else {
      this.error = await response.json();
    }
  }

  get loginUrl() {
    return url(`/login`);
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/views/Login.scss';
</style>
