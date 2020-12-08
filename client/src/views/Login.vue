<template>
  <b-container class="h-100 w-100 p-0 m-0" fluid>
    <!-- BACKGROUND -->
    <!-- :style="'background: yellow'" -->
    <img
      :src="require(`@port-of-mars/client/assets/marsbg.jpg`)"
      alt="Background Image"
      class="background-image h-100 w-100"
    />
    <!-- PLAYER IMAGES: POLITICIAN, PIONEER -->
    <b-row align-v="center" class="h-100">
      <b-col cols="auto" class="h-50 mr-auto">
        <img
          :src="require(`@port-of-mars/client/assets/characters-large/Politician.png`)"
          alt="Player Image"
          class="politician"
        />
      </b-col>
      <b-col class="h-50 text-center">
        <h2>Welcome to</h2>
        <router-link :to="'/'"><h1>Port of Mars</h1></router-link>
        <b-button v-if="isLoggedIn" @click="logout" variant="light" class="m-4" size="lg">
          {{ logoutText }}
        </b-button>
        <b-button v-else :href="asuLoginUrl" class="m-4" size="lg" variant="outline-light">
          Sign In via ASU CAS
        </b-button>

        <b-form class="justify-content-center" inline>
          <label class="sr-only" for="inline-form-input-name">Username</label>
          <b-form-input class="w-25 mx-3" id="inline-form-input-name" placeholder="DEV_LOGIN">
          </b-form-input>
          <b-button @click="toggleDevLogin" class="dev-login-toggler" pill v-if="isDevLoginEnabled">
            <b-icon-gear></b-icon-gear>
          </b-button>
        </b-form>
      </b-col>

      <b-col cols="auto" class="h-50">
        <img
          :src="require(`@port-of-mars/client/assets/characters-large/Pioneer.png`)"
          alt="Player Image"
          class="pioneer"
        />
      </b-col>
    </b-row>

    <!-- LOGIN -->
    <!-- <div class="content-wrapper row">
      <div class="logged-in col-12" >
        <b-button @click="logout" variant="outline-light" class="m-4" size="lg">
          {{ logoutText }}
        </b-button>
      </div>
      <div class="logged-out col-12" v-else>
        <b-button :href="asuLoginUrl" class="m-4" size="lg" variant="outline-light">
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
          <font-awesome-icon :icon="['fas', 'user-cog']" class="icon" size="lg" />
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
    </div> -->
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { url } from "@port-of-mars/client/util";
import { isDevOrStaging } from "@port-of-mars/shared/settings";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserCog } from "@fortawesome/free-solid-svg-icons/faUserCog";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faUserCog);

Vue.component("font-awesome-icon", FontAwesomeIcon);

@Component({})
export default class Login extends Vue {
  private username: string = "";
  private isLoggedIn: boolean = false;
  private error: string = "";
  private isDevLoginEnabled: boolean = false;
  private devLoginVisible: boolean = false;

  get devLoginTogglerClass() {
    return this.devLoginVisible ? "active" : "inactive";
  }

  get submitDisabled() {
    return !this.username;
  }

  get asuLoginUrl() {
    return url("/asulogin");
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
      username: fd.get("username"),
      password: "testing"
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
a {
  //color: transparent;
  text-decoration: none;
}

h1 {
  text-transform: uppercase;
  letter-spacing: 0.25rem;
  font-size: 6rem;
  font-weight: 700;
  color: $main-brand;
}

h2 {
  margin-bottom: 0;
  text-transform: uppercase;
  letter-spacing: 0.25rem;
  font-size: 2rem;
  font-weight: 700;
  color: $light-shade;
}

.background-image {
  position: absolute;
  top: 0;
  z-index: -1;
  opacity: 0.0625;
}

.politician,
.pioneer {
  height: 45vh;
  top: 15vh;
}

input[type="text"] {
  border: solid 0.1rem $light-shade;

  &:focus,
  &:active {
    outline: none;
  }

  &::placeholder {
    font-size: $font-med;
    font-weight: $medium !important;
    color: $light-shade-25;
  }
}

.dev-login-toggler {
  @include reset-button;
  height: 3rem;
  width: 3rem;
  padding: 0;
  border: 0.125rem solid $light-shade;
  border-radius: 50%;
  margin-top: 1rem;
  @include make-center;
  @include default-transition-base;

  &:hover {
    @include default-scale-up;
  }

  &.active {
    background-color: $light-shade;

    .icon {
      color: $dark-shade;
    }
  }

  &.inactive {
    background-color: transparent;

    .icon {
      color: $light-shade;
    }
  }
}
</style>
