<template>
  <b-container
    fluid
    class="h-100 w-100 d-flex flex-column justify-content-center align-items-center backdrop"
  >
    <b-img
      class="logo mb-5"
      v-bind="{ height: 120, width: 400 }"
      :src="$getAssetUrl(`images/logo-Port-of-Mars-White.svg`)"
      alt="the planet mars illustrated in white above Port of Mars"
    ></b-img>
    <div class="d-flex flex-column justify-content-center align-items-center px-0">
      <div style="width: 30rem">
        <b-tabs
          active-nav-item-class="font-weight-bold"
          active-tab-class="font-weight-bold"
          content-class="backdrop content-container rounded p-5 mt-3"
          @input="handleTabChange"
          pills
        >
          <b-tab active>
            <template #title> <b-icon-stars class="mr-2" />Join a game </template>
            <b-form @submit="handleJoinGame" class="d-flex flex-column align-items-center">
              <b-form-input
                v-model="gameCode"
                class="w-100 mb-3 text-center"
                size="lg"
                placeholder="Classroom code"
                @input="clearErrorMsg"
                required
              ></b-form-input>
              <b-button type="submit" variant="success" rounded class="w-100" size="lg">
                <h4 class="mb-0">Enter</h4>
              </b-button>
              <b-alert variant="danger" class="mt-5 mb-0 w-100 text-center" v-if="errorMsg" show>{{
                errorMsg
              }}</b-alert>
            </b-form>
          </b-tab>
          <b-tab title="Rejoin a game" title-link-class="small">
            <p class="text-muted text-left">
              Enter a rejoin code to sign back in if you were disconnected from a game
            </p>
            <b-form @submit="handleRejoinGame" class="d-flex flex-column align-items-center">
              <b-form-input
                v-model="rejoinCode"
                type="text"
                class="w-100 mb-3 text-center"
                size="lg"
                placeholder="Rejoin code"
                required
              ></b-form-input>
              <b-button type="submit" variant="success" rounded class="w-100" size="lg">
                <h4 class="mb-0">Rejoin Game</h4>
              </b-button>
              <b-alert variant="danger" class="mt-5 mb-0 w-100 text-center" v-if="errorMsg" show>{{
                errorMsg
              }}</b-alert>
            </b-form>
          </b-tab>
          <b-tab title-link-class="small">
            <template #title> <b-icon-lock-fill class="mr-1" />Sign in as an educator</template>
            <b-form @submit="handleTeacherLogin" class="d-flex flex-column align-items-center">
              <b-form-input
                v-model="username"
                class="w-100 mb-3 text-center"
                size="lg"
                placeholder="Username"
                @input="clearErrorMsg"
                required
              ></b-form-input>
              <b-form-input
                v-model="password"
                :type="passwordVisible ? 'text' : 'password'"
                class="w-100 mb-3 text-center"
                size="lg"
                placeholder="Password"
                @input="clearErrorMsg"
                required
              ></b-form-input>
              <b-button type="submit" variant="success" rounded class="w-100" size="lg">
                <h4 class="mb-0">Login</h4>
              </b-button>
              <b-alert variant="danger" class="mt-5 mb-0 w-100 text-center" v-if="errorMsg" show>{{
                errorMsg
              }}</b-alert>
            </b-form>
          </b-tab>
        </b-tabs>
      </div>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { AuthAPI } from "@port-of-mars/client/api/auth/request";
import Messages from "@port-of-mars/client/components/global/Messages.vue";

@Component({
  components: {
    Messages,
  },
})
export default class StudentLogin extends Vue {
  authApi!: AuthAPI;

  errorMsg = "";
  gameCode = "";
  rejoinCode = "";
  password = "";
  username = "";
  passwordVisible = false;

  created() {
    this.authApi = new AuthAPI(this.$store, this.$ajax, this.$router);
  }

  async handleJoinGame() {
    try {
      await this.authApi.studentLogin(this.gameCode);
    } catch (e) {
      this.errorMsg = (e as Error).message;
    }
  }

  async handleRejoinGame() {
    try {
      await this.authApi.studentRejoin(this.rejoinCode);
    } catch (e) {
      this.errorMsg = (e as Error).message;
    }
  }

  async handleTeacherLogin() {
    try {
      await this.authApi.teacherLogin({ username: this.username, password: this.password });
    } catch (e) {
      this.errorMsg = (e as Error).message;
    }
  }

  clearErrorMsg() {
    this.errorMsg = "";
  }

  handleTabChange() {
    this.clearErrorMsg();
    this.gameCode = "";
    this.rejoinCode = "";
    this.username = "";
    this.password = "";
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
</script>

<style lang="scss" scoped></style>
