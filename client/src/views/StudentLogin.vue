<template>
  <b-container fluid class="h-100 w-100 d-flex flex-column justify-content-center align-items-center backdrop">
    <h2 class="mb-3">JOIN A GAME</h2>
    <div id="login-container" class="content-container rounded d-flex flex-column justify-content-center align-items-center backdrop px-0">
      <div>
        <b-tabs
          active-nav-item-class="font-weight-bold text-uppercase text-danger"
          active-tab-class="font-weight-bold text-success"
          content-class="mt-3"
          @input="handleTabChange"
        >
          <b-tab title="JOIN A GAME" active>
            <div class="d-flex flex-column align-items-center">
            <p>default join tab</p>
            <b-form-input
              v-model="gameCode"
              class="w-70 mb-3 text-center"
              size="lg"
              placeholder="GAME CODE"
              required
            ></b-form-input>
            <!-- Rounded Enter button -->
            <b-button
              variant="primary"
              rounded
              @click="enterGame"
              class="w-70 mb-3"
              size="lg"
            >
              <h4 class="mb-0">Join Game</h4>
            </b-button>
            </div>
          </b-tab>
          <b-tab title="RE-JOIN A GAME">
            <div class="d-flex flex-column align-items-center">
            <p>rejoin tab</p>
            <b-form-input
              v-model="password"
              :type="passwordVisible ? 'text' : 'password'" 
              class="w-70 mb-3 text-center"
              size="lg"
              placeholder="PASSWORD"
              required
            ></b-form-input>
            <!-- Rounded Enter button -->
            <b-button
              variant="primary"
              rounded
              @click="enterGame"
              class="w-70 mb-3"
              size="lg"
            >
              <h4 class="mb-0">Re-join Game</h4>
            </b-button>
            
          </div>
          </b-tab>
          <b-tab title="SIGN IN AS TEACHER">
            <div class="d-flex flex-column align-items-center">
            <p>teacher login tab</p>
            <b-form-input
              v-model="username"
              class="w-70 mb-3 text-center"
              size="lg"
              placeholder="USERNAME"
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
            <b-button
              variant="primary"
              rounded
              @click="enterGame"
              class="w-70 mb-3"
              size="lg"
            >
              <h4 class="mb-0">Login</h4>
            </b-button>

            </div>
          </b-tab>
        </b-tabs>
      </div>
      
      <!-- Rounded text field for game code 
      <b-form-input
        v-if="!alreadyJoined"
        v-model="gameCode"
        class="w-70 mb-3 text-center"
        size="lg"
        placeholder="GAME CODE"
        required
      ></b-form-input> -->

      <!-- Rounded text field for password (displayed when already joined a game) 
      <b-form-input
        v-model="password"
        :type="passwordVisible ? 'text' : 'password'" 
        class="w-70 mb-3 text-center"
        size="lg"
        placeholder="PASSWORD"
        required
        v-if="alreadyJoined"
      ></b-form-input> -->

      <!-- Rounded Enter button 
      <b-button
        variant="primary"
        rounded
        @click="enterGame"
        class="w-70 mb-3"
        size="lg"
      >
         <h4 class="mb-0" v-if="!alreadyJoined">Join Game</h4>
         <h4 class="mb-0" v-if="alreadyJoined">Re-join Game</h4>
    </b-button> -->
      
      <!-- Checkbox for indicating if already joined a game 
      <b-form-checkbox v-model="alreadyJoined" class="already-joined-checkbox">
        Already joined a game?
      </b-form-checkbox> -->
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
  username: string = "";
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
  
  handleTabChange(index: number){
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
