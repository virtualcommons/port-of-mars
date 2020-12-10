<template>
  <b-container class="h-100 w-100 p-0 m-0 parent" fluid>
    <!-- BACKGROUND IMAGE -->
    <img
      :src="require(`@port-of-mars/client/assets/background/space_open.png`)"
      alt="Background Image"
      class="background-image w-100"
    >
    </img>

    <section>
      <b-row align-v="center" class="h-100 p-5 text-center">
        <b-col></b-col>
        <b-col align-self="end" class="m-5 " cols="8">
          <h2 class="p-5">
            Port of Mars is a fun, game-based social science experiment set on the first human
            community on the Red Planet.
          </h2>
          <b-icon-arrow-down-circle-fill scale=2></b-icon-arrow-down-circle-fill>
        </b-col>
        <b-col></b-col>
      </b-row>
    </section>

    <!-- LOGIN -->
    <section>
      <b-row align-v="center" class="h-100 p-5 text-center">
        <b-col></b-col>
        <b-col align-self="center" class="m-0 p-5 text-center" cols="8">

          <b-card
            header="Register"
            header-bg-variant="primary"
            style="font-family: '$exo'; text-transform: uppercase;"
          >
            <b-card-text>
              <p class="py-2"><strong>Sign up to be notified about the next opportunity to play in the Mars Madness
                tournament.</strong></p>

              <b-button v-if="isLoggedIn" class="m-4" size="lg" variant="danger" @click="logout">
                {{ logoutText }}
              </b-button>
              <b-button v-else :href="asuLoginUrl" class="mt-2 mb-5" size="lg" variant="info">
                Sign Up via ASU CAS
              </b-button>

              <b-form v-if="isDevLoginEnabled" class="justify-content-center" inline @submit="devLogin">
                <label class="sr-only" for="input-username">Username</label>
                <b-form-input id="input-username" v-model="username" class="w-25 mx-3" placeholder="DEV_LOGIN" required>
                </b-form-input>
                <b-button type="submit">
                  <b-icon-gear></b-icon-gear>
                </b-button>
              </b-form>
            </b-card-text>
          </b-card>
        </b-col>
        <b-col></b-col>
      </b-row>
    </section>

    <section>
      <b-row align-v="center" class="h-100 p-5 text-center">
        <b-col></b-col>
        <b-col :style="'background-color: grey'" align-self="center" class="m-0 p-5 text-center" cols="8">
          <h2>Consent Form</h2>
        </b-col>
        <b-col></b-col>
      </b-row>
    </section>
    <section>
      <b-row align-v="center" class="h-100 p-5 text-center">
        <b-col></b-col>
        <b-col :style="'background-color: grey'" align-self="center" class="m-0 p-5 text-center" cols="8">
          <h2>Consent Form</h2>
        </b-col>
        <b-col></b-col>
      </b-row>
    </section>s

    <!-- OLD LOGIN -->
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
import {Component, Vue} from "vue-property-decorator";
import {url} from "@port-of-mars/client/util";
import {isDevOrStaging} from "@port-of-mars/shared/settings";

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
    const devLoginData: any = {
      username: this.username,
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
// HTML TEXT ELEMENTS
a {
  //color: transparent;
  text-decoration: none;
}

h2 {
  margin-bottom: 0;
  text-transform: uppercase;
  letter-spacing: 0.25rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: $light-shade;
}

// IMAGES

.background-image {
  position: absolute;
  max-width: 100vw;
  height: auto;
  z-index: -1;
  // object-fit: cover;
  // object-position: bottom;
}

section {
  scroll-snap-align: start;
  height: 100vh;
  width: 100vw;
}

// LOGIN :: FORM

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
