<template>
  <b-container fluid class="h-100 w-100 d-flex flex-column justify-content-center align-items-center backdrop">
    <h2 class="mb-3">JOIN A GAME</h2>
    <div id="login-container" class="content-container rounded d-flex flex-column justify-content-center align-items-center backdrop px-0">
      <!-- Rounded text field for game code -->
      <b-form-input
        v-if="!alreadyJoined"
        v-model="gameCode"
        class="w-70 mb-3 text-center"
        size="lg"
        placeholder="GAME CODE"
        required
      ></b-form-input>

      <!-- Rounded text field for password (displayed when already joined a game) -->
      <b-form-input
        v-model="password"
        :type="passwordVisible ? 'text' : 'password'" 
        class="w-70 mb-3 text-center"
        size="lg"
        placeholder="PASSWORD"
        required
        v-if="alreadyJoined"
      ></b-form-input>

      <!-- Rounded Enter button -->
      <b-button
        variant="primary"
        rounded
        @click="enterGame"
        class="w-70 mb-3"
        size="lg"
      >
         <h4 class="mb-0" v-if="!alreadyJoined">Join Game</h4>
         <h4 class="mb-0" v-if="alreadyJoined">Re-join Game</h4>
    </b-button>
      
      <!-- Checkbox for indicating if already joined a game -->
      <b-form-checkbox v-model="alreadyJoined" class="already-joined-checkbox">
        Already joined a game?
      </b-form-checkbox>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { AuthAPI } from "@port-of-mars/client/api/auth/request";

@Component
export default class StudentLogin extends Vue {
  authApi!: AuthAPI;

  gameCode: string = "";
  alreadyJoined: boolean = false;
  password: string = "";
  passwordVisible: boolean = false; // For toggling password visibility

  created() {
    this.authApi = new AuthAPI(this.$store, this.$ajax, this.$router);
  }

  enterGame() {
    // Handle entering the game here
    console.log("Enter button clicked");
    if (this.alreadyJoined) {
      console.log("Password entered:", this.password);
    } else {
      console.log("Game code entered:", this.gameCode);
      this.authApi.studentLogin(this.gameCode);
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible; // Toggle password visibility
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
