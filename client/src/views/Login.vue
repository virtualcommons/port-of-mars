<template>
  <div class="w-100 h-100 p-3">
    <div
      class="w-100 h-100 d-flex flex-column justify-content-around align-items-center"
    >
      <div class="d-flex flex-column justify-content-around align-items-center">
        <h1 class="display-1 font-weight-bold text-uppercase text-space-orange">
          Port of Mars
        </h1>
        <h1
          class="display-4 font-weight-bold text-uppercase text-4xl text-space-orange"
        >
          Sign In
        </h1>
      </div>
      <div
        class="my-3 d-flex justify-content-center align-items-center"
        v-if="isLoggedIn"
      >
        <input
          type="button"
          @click="logout"
          :value="logoutText"
          class="btn btn-space-lg"
        />
      </div>
      <form
        class="d-flex flex-column justify-content-center align-items-center"
        v-else
      >
        <div
          class="p-2 my-3 d-flex flex-column justify-content-center align-items-center"
        >
          <label
            for="username"
            class="w-100 pb-2 text-xl text-center text-space-white-025"
            style="border-bottom: 0.0625rem solid var(--space-white-opaque-2);"
            >ASURITE ID</label
          >
          <div
            class="p-2 border-space-orange-025 d-flex justify-content-center align-items-center"
            style="height: 5rem; width: 25rem;"
          >
            <input
              type="text"
              id="username"
              name="username"
              autocomplete="off"
              v-model="username"
              class="w-100 h-100 p-2 reset-text-input"
            />
          </div>
        </div>
        <div class="submit">
          <input
            :disabled="submitDisabled"
            type="submit"
            @click="login"
            value="Login"
            class="btn btn-space-lg mb-3"
          />
        </div>
        <p class="w-50 text-2xl text-center text-status-red" v-if="error">
          {{ error }}
        </p>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { GAME_PAGE, LOBBY_PAGE, LOGIN_PAGE } from '@port-of-mars/shared/routes';

@Component({})
export default class Login extends Vue {
  private username: string = '';
  private isLoggedIn: boolean = false;
  private error: string = '';

  created() {
    this.isLoggedIn = !!this.$ajax.username;
  }

  get submitDisabled() {
    return !this.username;
  }

  get logoutText() {
    return `Logout (${this.$tstore.state.user.username})`;
  }

  private async logout() {
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
      this.$router.push({ name: LOBBY_PAGE });
    } else {
      this.error = await response.json();
    }
  }

  get loginUrl() {
    return `${process.env.SERVER_URL_HTTP}/login`;
  }
}
</script>

<style lang="scss" scoped></style>
