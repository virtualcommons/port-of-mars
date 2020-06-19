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
        <div class="logged-in col-12" v-if="isLoggedIn">
          <b-button
            @click="logout"
            variant="outline-light"
            class="m-4"
            size="lg"
          >
            {{ logoutText }}
          </b-button>
        </div>
        <div class="logged-out col-12" v-else>
          <b-button
            :href="asuLoginUrl"
            class="m-4"
            size="lg"
            variant="outline-light"
          >
            Sign In via ASU CAS
          </b-button>
          <b-button
            :class="devLoginTogglerClass"
            @click="toggleDevLogin"
            class="dev-login-toggler"
            size="lg"
            pill
            variant="outline-light"
            v-if="isDevLoginEnabled"
          >
            <font-awesome-icon
              :icon="['fas', 'user-cog']"
              class="icon"
              size="lg"
            />
          </b-button>
          <form class="login-form" v-if="isDevLoginEnabled && devLoginVisible">
            <div class="input-username">
              <label for="username">Developer Login (TESTING ONLY)</label>
              <div class="input-wrapper">
                <input
                  autocomplete="off"
                  id="username"
                  name="username"
                  placeholder="Username"
                  type="text"
                  v-model="username"
                />
              </div>
            </div>
<!--            <b-button-->
<!--              :disabled="submitDisabled"-->
<!--              variant="outline-light"-->
<!--              @click="devLogin"-->
<!--            >-->
<!--              Login-->
<!--            </b-button>-->
            <div class="submit">
              <input
                :disabled="submitDisabled"
                @click="devLogin"
                class="button-white"
                type="submit"
                value="Login"
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
  import {Component, Vue} from 'vue-property-decorator';
  import {url} from '@port-of-mars/client/util';
  import {isDevOrStaging} from '@port-of-mars/shared/settings';

  import {library} from '@fortawesome/fontawesome-svg-core';
  import {faUserCog} from '@fortawesome/free-solid-svg-icons/faUserCog';
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

  library.add(faUserCog);

  Vue.component('font-awesome-icon', FontAwesomeIcon);

  @Component({})
  export default class Login extends Vue {
    private username: string = '';
    private isLoggedIn: boolean = false;
    private error: string = '';
    private isDevLoginEnabled: boolean = false;
    private devLoginVisible: boolean = false;

    get devLoginTogglerClass() {
      return this.devLoginVisible ? 'active' : 'inactive';
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

    private toggleDevLogin() {
      this.devLoginVisible = !this.devLoginVisible;
    }
  }
</script>

<style lang="scss" scoped>
  @import '@port-of-mars/client/stylesheets/views/Login.scss';
</style>
