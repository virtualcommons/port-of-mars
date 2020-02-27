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
import {GAME_PAGE} from "shared/routes";

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
      this.$router.push(GAME_PAGE);
    } else {
      this.error = await response.json();
    }
  }

  get loginUrl() {
    return `${process.env.SERVER_URL_HTTP}/login`;
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/views/Login.scss';
</style>
