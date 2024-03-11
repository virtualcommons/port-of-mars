<template>
  <b-container fluid class="h-100 w-100 d-flex justify-content-center align-items-center backdrop">
    <label class="join-game-label">JOIN A GAME</label>
    <div id="login-container" class="content-container rounded d-flex flex-column justify-content-center align-items-center backdrop" style="padding-left: 0.1rem; padding-right: 0.1rem;">
      <!-- Rounded text field for game code -->
      <b-form-input
        v-if="!alreadyJoined"
        v-model="gameCode"
        class="rounded-input w-70"
        placeholder="GAME CODE"
        required
      ></b-form-input>

     <!-- Rounded text field for password (displayed when already joined a game) -->
      <b-form-input
        v-model="password"
        :type="passwordVisible ? 'text' : 'password'" 
        class="rounded-input w-70"
        placeholder="PASSWORD"
        required
        v-if="alreadyJoined"
      ></b-form-input>

      <!-- Rounded Enter button -->
      <b-button
        variant="primary"
        rounded
        @click="enterGame"
        class="rounded-button w-70"
        style="background-color: white; color: black"
      >
         <span class="enter-text" v-if="!alreadyJoined">Join Game</span>
         <span class="enter-text" v-if="alreadyJoined">Re-join Game</span>
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
import { isDevOrStaging } from "@port-of-mars/shared/settings";

@Component
export default class StudentLogin extends Vue {
  gameCode: string = '';
  alreadyJoined: boolean = false;
  password: string = '';
  passwordVisible: boolean = false; // For toggling password visibility

  created() {
    
  }

  enterGame() {
    // Handle entering the game here
    console.log("Enter button clicked");
    if (this.alreadyJoined) {
      console.log("Password entered:", this.password);
    } else {
      console.log("Game code entered:", this.gameCode);
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
  text-align: center; /* Center the content horizontally */
}

.join-game-label {
  color: white;
  font-size: 2rem;
  margin-bottom: 1rem;
  display: block; /* Ensure label takes full width */
  font-weight: bold; 
  position: relative; 
  top: -165px; 
  left: 335px; 
}

.rounded-input, .rounded-button {
  width: 70%; 
  border-radius: 20px;
  margin-bottom: 1rem;
  padding: 0.5rem;
  display: flex; 
  justify-content: center; 
  align-items: center; 
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}

.rounded-button {
  min-width: 150px;
  margin-top: 1rem; 
}

.enter-text {
  font-weight: bold; 
  font-size: 20px;
}

.already-joined-checkbox {
  color: white; 
  margin-bottom: 1rem; 
  padding: 0.5rem;
}

</style>
