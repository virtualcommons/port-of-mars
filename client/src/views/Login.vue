<template>
  <div class="c-login">
    <div class="container">

      <!-- BACKGROUND -->
      <img
        :src="require(`@port-of-mars/client/assets/marsbg.jpg`)"
        alt="Background Image"
        class="background-image"
      />

      <!-- PLAYER IMAGES: POLITICIAN, PIONEER -->
      <div class="d-flex">
        <img
          :src="
          require(`@port-of-mars/client/assets/characters-large/Politician.png`)
        "
          alt="Player Image"
          class="politician"
        />
        <img
          :src="
          require(`@port-of-mars/client/assets/characters-large/Pioneer.png`)
        "
          alt="Player Image"
          class="pioneer"
        />
      </div>

      <!-- TITLE -->
      <div class="title-wrapper row">
        <div class="title col-12">
          <router-link :to="'/'">
            <h1>Port of Mars</h1>
          </router-link>
          <h2>Welcome</h2>
        </div>
      </div>

      <!-- LOGIN -->
      <div class="content-wrapper row">
        <div v-if="isLoggedIn" class="logged-in col-12">
          <input
            @click="logout"
            :value="logoutText"
            type="button"
            class="button-orange"
          />
        </div>
        <div v-else class="logged-out col-12">
          <BButton :href="asuLoginUrl" class="button-orange">
            Sign In via ASU CAS
          </BButton>
          <button
            v-if="isDevLoginEnabled"
            @click="toggleDevLogin"
            :class="devLoginTogglerClass"
            class="dev-login-toggler"
          >
            <font-awesome-icon
              :icon="['fas', 'user-cog']"
              size="lg"
              class="icon"
            />
          </button>
          <form class="login-form" v-if="isDevLoginEnabled && devLoginVisible">
            <div class="input-username">
              <label for="username">Developer Login (TESTING ONLY)</label>
              <div class="input-wrapper">
                <input
                  v-model="username"
                  type="text"
                  placeholder="Username"
                  autocomplete="off"
                  name="username"
                  id="username"
                />
              </div>
            </div>
            <div class="submit">
              <input
                @click="devLogin"
                :disabled="submitDisabled"
                type="submit"
                value="Login"
                class="button-white"
              />
            </div>
            <p class="error" v-if="error">{{ error }}</p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { url } from '@port-of-mars/client/util';
import { isDevOrStaging } from '@port-of-mars/shared/settings';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserCog } from '@fortawesome/free-solid-svg-icons/faUserCog';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faUserCog);

Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({})
export default class Login extends Vue {
  private username: string = '';
  private isLoggedIn: boolean = false;
  private error: string = '';
  private isDevLoginEnabled: boolean = false;
  private devLoginVisible: boolean = false;

  created() {
    this.isLoggedIn = !!this.$ajax.username;
    this.isDevLoginEnabled = isDevOrStaging();
  }

  async devLogin(e: Event) {
    e.preventDefault();
    const fd = new FormData((e as any).target.form);
    const devLoginData: any = {
      username: fd.get('username'),
      password: 'testing',
    };
    try {
      await this.$ajax.devLogin(devLoginData);
    } catch (e) {
      this.error = e.message;
    }
  }

  private logout() {
    this.$ajax.forgetLoginCreds();
    this.$ajax.forgetSubmissionId();
    this.isLoggedIn = false;
  }

  get devLoginTogglerClass() {
    return this.devLoginVisible ? 'active' : 'inactive';
  }

  private toggleDevLogin() {
    this.devLoginVisible = !this.devLoginVisible;
  }

  get submitDisabled() {
    return !this.username;
  }

  get asuLoginUrl() {
    return url('/asulogin');
  }

  get logoutText() {
    const username = this.$tstore.state.user.username;
    return username ? `Logout (${username})` : `Logout (Expired)`;
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/views/Login.scss';
</style>
