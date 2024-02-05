<template>
  <b-container fluid class="h-100 w-100 d-flex justify-content-center align-items-center backdrop">
    <div id="login-container" class="content-container">
      <b-form>
        <!-- Rounded rectangle container for the UI -->
        <b-card class="rounded p-4 text-center">
          <h1 class="text-white">Join a game</h1>
          <hr />

          <!-- Rounded rectangle for the game code input box -->
          <b-form-input
            class="w-100 mb-3"
            id="input-game-code"
            placeholder="Enter game code"
            required
            rounded
            style="background-color: var(--backdrop-color); color: var(--text-color)"
          ></b-form-input>

          <!-- Rounded rectangle for the enter button -->
          <b-button
            class="w-100 mb-3"
            type="submit"
            variant="primary"
            size="lg"
            rounded
            style="background-color: white; color: black"
          >
            Enter
          </b-button>

          <div v-if="isDevMode">
            <b-form-checkbox v-model="toggleDevLogin">
              <p v-if="toggleDevLogin">Test Mode Enabled</p>
              <p v-else>Enable Test Mode</p>
            </b-form-checkbox>
            <b-form inline v-if="isDevMode && toggleDevLogin" @submit="devLogin">
              <b-form-checkbox v-model="shouldSkipVerification">
                <p>Skip consent/verification</p>
              </b-form-checkbox>
              <b-form-input
                class="w-100 mb-2"
                id="input-username"
                v-model="devLoginUsername"
                placeholder="Sign up or sign back in with a username"
                required
              ></b-form-input>
              <b-button class="w-100 mb-3" type="submit" variant="primary" size="lg" rounded>
                <b-icon-file-earmark-code class="float-left" />Sign in (Test Mode)
              </b-button>
            </b-form>
            <b-alert v-if="error" variant="warning">{{ error }}</b-alert>
          </div>
        </b-card>
      </b-form>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { isDevOrStaging } from "@port-of-mars/shared/settings";

@Component
export default class StudentLogin extends Vue {
  isDevMode: boolean = false;
  toggleDevLogin: boolean = false;
  shouldSkipVerification: boolean = true;
  devLoginUsername: string = "";
  error: string = "";

  created() {
    this.isDevMode = isDevOrStaging();
  }

  async devLogin(e: Event) {
    e.preventDefault();
    const devLoginData: any = {
      username: this.devLoginUsername,
      password: "testing",
    };
    try {
      console.log(this.shouldSkipVerification);
      await this.$ajax.devLogin(devLoginData, this.shouldSkipVerification);
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

ul {
  list-style: circle !important;
  padding-left: 2rem;
}
</style>
