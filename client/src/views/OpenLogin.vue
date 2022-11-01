<template>
  <b-container fluid class="h-100 w-100 d-flex justify-content-center align-items-center backdrop">
    <div id="login-container" class="content-container">
      <b-form>
        <h1 class="text-center">Login or Sign Up</h1>
        <hr>
        <p>
          Port of Mars is now in open beta, meaning anyone is welcome to sign up and
          play as long you adhere to our
          <a href="https://github.com/virtualcommons/port-of-mars/wiki/Port-of-Mars-Chat-Code-of-Conduct"
            target="_blank">code of conduct</a>.
        </p>
        <hr>
        <div v-if=isDevMode>
          <b-form-checkbox v-model="toggleDevLogin">
            <p v-if="toggleDevLogin">Test Mode Enabled</p>
            <p v-else>Enable Test Mode</p>
          </b-form-checkbox>
          <b-form inline v-if="isDevMode && toggleDevLogin" @submit="devLogin">
            <b-form-input class="w-100" id="input-username" v-model="devLoginUsername"
              placeholder="Sign up or sign back in with a test username" required>
            </b-form-input>
            <b-button class="w-100 mb-3" type="submit" variant="primary" size="lg">
              <b-icon icon="file-earmark-code" class="float-left"/>Sign in (Dev Mode)
            </b-button>
          </b-form>
          <b-alert v-if="error" variant="warning">{{ error }}</b-alert>
        </div>
        <b-button block variant="white" size="lg" class="mb-3" :href="googleLoginUrl">
          <b-icon icon="google" class="float-left" />Sign in with Google
        </b-button>
        <b-button block variant="facebook" size="lg" class="mb-3" :href="facebookLoginUrl">
          <b-icon icon="facebook" class="float-left"/>Sign in with Facebook
        </b-button>
      </b-form>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { url } from "@port-of-mars/client/util";
import { isDevOrStaging } from "@port-of-mars/shared/settings";
import { REGISTER_PAGE } from "@port-of-mars/shared/routes";

@Component({})
export default class OpenLogin extends Vue {
  isDevMode: boolean = false;
  toggleDevLogin: boolean = false;
  devLoginUsername: string = "";
  error: string = "";

  register = { name: REGISTER_PAGE };

  async created() {
    this.isDevMode = isDevOrStaging();
  }

  get googleLoginUrl() {
    return url("/auth/google")
  }

  get facebookLoginUrl() {
    return url("/auth/facebook")
  }

  async devLogin(e: Event) {
    e.preventDefault();
    const devLoginData: any = {
      username: this.devLoginUsername,
      password: "testing"
    };
    try {
      await this.$ajax.devLogin(devLoginData);
    } catch (e) {
      if (e instanceof Error) {
        this.error = e.message;
      }
    }
  }
}
</script>

<style lang="scss" scoped>

#login-container {
  padding: 2rem;
  width: 30rem;
}

</style>
