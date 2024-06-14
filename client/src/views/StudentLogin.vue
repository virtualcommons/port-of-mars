<template>
  <b-container
    fluid
    class="h-100 w-100 d-flex flex-column justify-content-center align-items-center backdrop"
  >
    <h2 class="mb-3">JOIN A GAME</h2>
    <div
      id="login-container"
      class="content-container rounded d-flex flex-column justify-content-center align-items-center backdrop px-0"
    >
      <div>
        <b-tabs
          active-nav-item-class="font-weight-bold text-uppercase text-danger"
          active-tab-class="font-weight-bold text-success"
          content-class="mt-3"
          @input="handleTabChange"
        >
          <b-tab title="JOIN A GAME" active>
            <div class="d-flex flex-column align-items-center">
              <b-form-input
                v-model="gameCode"
                class="w-70 mb-3 text-center"
                size="lg"
                placeholder="GAME CODE"
                @input="clearErrorMessage"
                required
              ></b-form-input>
              <!-- Rounded Enter button -->
              <b-button variant="primary" rounded @click="enterGame" class="w-70 mb-3" size="lg">
                <h4 class="mb-0">Join Game</h4>
              </b-button>
              <b-alert variant="danger" v-if="errorMessage" show>{{ errorMessage }}</b-alert>
            </div>
          </b-tab>
          <b-tab title="RE-JOIN A GAME">
            <div class="d-flex flex-column align-items-center">
              <b-form-input
                v-model="password"
                :type="passwordVisible ? 'text' : 'password'"
                class="w-70 mb-3 text-center"
                size="lg"
                placeholder="PASSWORD"
                required
              ></b-form-input>
              <!-- Rounded Enter button -->
              <b-button variant="primary" rounded @click="enterGame" class="w-70 mb-3" size="lg">
                <h4 class="mb-0">Re-join Game</h4>
              </b-button>
            </div>
          </b-tab>
          <b-tab title="SIGN IN AS TEACHER">
            <div class="d-flex flex-column align-items-center">
              <b-form-input
                v-model="email"
                class="w-70 mb-3 text-center"
                size="lg"
                placeholder="EMAIL"
                required
              ></b-form-input>
              <b-form-input
                v-model="password"
                :type="passwordVisible ? 'text' : 'password'"
                class="w-70 mb-3 text-center"
                size="lg"
                placeholder="PASSWORD"
                required
              ></b-form-input>
              <b-button variant="primary" rounded @click="enterTeacher" class="w-70 mb-3" size="lg">
                <h4 class="mb-0">Login</h4>
              </b-button>
            </div>
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

  gameCode: string = "";
  alreadyJoined: boolean = false;
  password: string = "";
  username: string = "";
  email: string = "";
  errorMessage: string = "";
  passwordVisible: boolean = false; // For toggling password visibility

  created() {
    this.authApi = new AuthAPI(this.$store, this.$ajax, this.$router);
  }

  async enterGame() {
    console.log("Enter button clicked");
    this.errorMessage = "";
    try {
      if (this.alreadyJoined) {
        console.log("Password entered:", this.password);
        //add in api for student rejoin
      } else {
        console.log("Game code entered:", this.gameCode);
        await this.authApi.studentLogin(this.gameCode);
      }
    } catch (error: any) {
      this.errorMessage =
        error.response?.data?.message || "Game code does not exist or is incorrect";
    }
  }

  clearErrorMessage() {
    this.errorMessage = "";
  }

  enterTeacher() {
    console.log("Enter teacher dashboard button clicked");
    this.authApi.teacherLogin({ username: this.username, password: this.password });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible; // Toggle password visibility
  }

  handleTabChange(index: number) {
    //already joined set to true when on rejoin tab (index 1)
    this.alreadyJoined = index === 1;
  }
}
</script>

<style lang="scss" scoped>
#login-container {
  padding: 2rem;
  width: 30rem;
  text-align: center;
}
</style>
