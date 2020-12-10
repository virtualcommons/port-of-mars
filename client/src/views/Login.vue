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
      <b-row class="h-100 p-5 text-center" align-v="center">
        <b-col></b-col>
        <b-col align-self="center" cols="8" class="m-0 p-5">
          <h2 class="py-4">
          Port of Mars is a fun, game-based social science experiment set on the first human
          community on the Red Planet.
          </h2>
          <h4 class="py-4">
          Sign up to be notified about the next opportunity to play Port of Mars in the Mars Madness
          tournament.
          </h4>
          <b-icon-arrow-down-circle-fill scale=2></b-icon-arrow-down-circle-fill>
        </b-col>
        <b-col></b-col>
      </b-row>
    </section>

    <!-- LOGIN -->
    <section>
      <b-row class="h-100 p-5 text-center" align-v="center">
        <b-col></b-col>
        <b-col align-self="center" cols="8" class="blurred-box m-0 p-5 text-center">
          <b-button v-if="isLoggedIn" @click="logout" variant="danger" class="m-4" size="lg">
            {{ logoutText }}
          </b-button>
          <b-button v-else :href="asuLoginUrl" class="m-5" size="lg" variant="secondary">
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
        <b-col></b-col>
      </b-row>
    </section>

    <section>
      <b-row class="h-100 p-5 text-center" align-v="center">
        <b-col></b-col>
        <b-col align-self="center" cols="8" class="m-0 p-5 text-center" :style="'background-color: grey'">
          <h2>Consent Form</h2>

        </b-col>
        <b-col></b-col>
      </b-row>
    </section>

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
// HTML TEXT ELEMENTS
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

// IMAGES

.background-image {
  position: absolute;
  z-index: -1;
}

section {
  scroll-snap-align: start;
  height: 100vh;
  width: 100vw;
}

.blurred-box{
  position: relative;
  width: 250px;
  height: 350px;
  top: calc(50% - 175px);
  left: calc(50% - 125px);
  background: inherit;
  border-radius: 2px;
  overflow: hidden;
}

.blurred-box:after{
 content: '';
 width: 300px;
 height: 300px;
 background: inherit; 
 position: absolute;
 left: -25px;
 right: 0;
 top: -25px;  
 bottom: 0;
 box-shadow: inset 0 0 0 200px rgba(255,255,255,0.05);
 filter: blur(10px);
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
