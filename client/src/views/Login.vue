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
            <input :disabled="submitDisabled" type="submit" @click="login" value="Login" />
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

  async login(e: Event) {
    e.preventDefault();
    const fd = new FormData((e as any).target.form);
    const data: any = { username: fd.get("username"), password: "testing" };
    const response = await this.$ajax.post(this.loginUrl, data);
    await this.$ajax.setLoginCreds(response);
    if (response.status === 200) {
      this.$router.push({ name: DASHBOARD_PAGE });
    } else {
      this.error = await response.json();
    }
  }

  get loginUrl() {
    return url("/login");
  }
}
</script>

<style lang="scss" scoped>
@import "@port-of-mars/client/stylesheets/views/Login.scss";
</style>
