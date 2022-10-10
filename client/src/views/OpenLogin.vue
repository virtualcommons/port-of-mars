<template>
  <b-container fluid class="h-100 w-100 d-flex justify-content-center align-items-center">
    <div id="login-container">
      <b-form>
        <h1 class="text-center">Login or Sign Up</h1>
        <hr>
        <p>
          Port of Mars is now in open beta, meaning anyone is welcome to sign up and
          play as long you adhere to our <a href="" target="_blank">code of conduct</a>.
        </p>
        <hr>
        <b-button :to="usernamePage" block variant="primary" size="lg" class="mb-3">
          <b-icon icon="file-earmark-code" class="float-left"/>Sign in (Dev Mode)
        </b-button>
        <b-button block variant="white" size="lg" class="mb-3">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
            class="float-left" style="width:1.25em"/>Sign in with Google
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
import { USERNAME_PAGE } from "@port-of-mars/shared/routes";

@Component({})
export default class OpenLogin extends Vue {
  isDevMode: boolean = false;

  usernamePage = { name: USERNAME_PAGE };

  async created() {
    this.isDevMode = isDevOrStaging();
  }
}
</script>

<style lang="scss" scoped>

hr {
  margin: 2rem 0 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

#login-container {
  padding: 2rem;
  border-radius: 1rem;
  margin-top: -10rem;
  width: 30rem;
  background-color: rgba(0, 0, 0, 0.25);
}

</style>
