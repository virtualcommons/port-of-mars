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
        <b-button v-if="isDevMode" @click="devLogin" block variant="primary" size="lg" class="mb-3">
          <b-icon icon="file-earmark-code" class="float-left"/>Sign in (Dev Mode)
        </b-button>
        <b-button block variant="white" size="lg" class="mb-3" :href="googleLoginUrl">
          <b-icon icon="google" class="float-left" />Sign in with Google
        </b-button>
        <b-button block variant="facebook" size="lg" class="mb-3">
          <b-icon icon="facebook" class="float-left"/>Sign in with Facebook
        </b-button>
        <b-button block variant="black" size="lg">
          <b-icon icon="github" class="float-left"/>Sign in with Github
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

  register = { name: REGISTER_PAGE };

  async created() {
    this.isDevMode = isDevOrStaging();
  }

  get googleLoginUrl() {
    return url("/auth/google")
  }

  async devLogin(e: Event) {
    e.preventDefault();
    const devLoginData: any = {
      username: "testing",
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
