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
      <div v-else>
        <BButton squared size="lg" variant="dark" :href="asuLoginUrl" class="button">
        Sign In via ASU CAS
        </BButton>
        <form class="login-form" v-if="isDevLoginEnabled">
          <div class="input-username">
            <label for="username">Developer Login (TESTING ONLY)</label>
            <div class="input-wrapper">
              <input placeholder="Username" type="text" id="username" name="username" autocomplete="off" v-model="username" />
            </div>
          </div>
          <div class="submit">
            <input :disabled="submitDisabled" type="submit" @click="devLogin" value="Login" />
          </div>
          <p class="error" v-if="error">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import {
  DASHBOARD_PAGE,
  GAME_PAGE,
  LOBBY_PAGE,
  LOGIN_PAGE
} from "@port-of-mars/shared/routes";
import { url } from "@port-of-mars/client/util";
import { isDevOrStaging } from "@port-of-mars/shared/settings";
import { BButton } from "bootstrap-vue";
import { AjaxResponseError } from "../plugins/ajax";


@Component({})
export default class Login extends Vue {
  username = "";
  isLoggedIn = false;
  error = "";
  isDevLoginEnabled = false;

  created() {
    this.isLoggedIn = !!this.$ajax.username;
    this.isDevLoginEnabled = isDevOrStaging();
  }

  get submitDisabled() {
    return !this.username;
  }

  get asuLoginUrl() {
    return url("/asulogin");
  }

  get logoutText() {
    return `Logout (${this.$tstore.state.user.username})`;
  }

  logout() {
    this.$ajax.forgetLoginCreds();
    this.$ajax.forgetSubmissionId();
    this.isLoggedIn = false;
  }

  async devLogin(e: Event) {
    e.preventDefault();
    const fd = new FormData((e as any).target.form);
    const devLoginData: any = { username: fd.get("username"), password: "testing" };
    try {
      await this.$ajax.devLogin(devLoginData);
    }
    catch (e) {
      this.error = e.message;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@port-of-mars/client/stylesheets/views/Login.scss";
</style>
