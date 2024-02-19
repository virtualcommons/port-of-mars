<template>
  <b-container fluid class="h-100 w-100 d-flex justify-content-center align-items-center backdrop">
    <label class="join-game-label">JOIN A GAME</label>
    <div id="login-container" class="content-container rounded d-flex flex-column justify-content-center align-items-center backdrop" style="padding-left: 0.1rem; padding-right: 0.1rem;">
      <!-- Rounded text field for game code -->
      <b-form-input
        v-model="gameCode"
        class="rounded-input w-70"
        placeholder="GAME CODE"
      ></b-form-input>
          
      <!-- Rounded Enter button -->
      <b-button
        variant="primary"
        rounded
        @click="enterGame"
        class="rounded-button w-70"
        style="background-color: white; color: black"
      >
         <span class="enter-text">Enter</span>
      </b-button>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { isDevOrStaging } from "@port-of-mars/shared/settings";

@Component
export default class StudentLogin extends Vue {
  gameCode: string = '';

  created() {
    
  }

  enterGame() {
    // Handle entering the game here
    console.log("Enter button clicked");
    console.log("Game code entered:", this.gameCode);
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
  font-size: 1.5rem;
  margin-bottom: 1rem;
  display: block; /* Ensure label takes full width */
  font-weight: bold; /* Make the label bold */
  position: relative; /* Set position to relative */
  top: -110px; /* Move the label up by 50px */
  left: 310px; /* Move the label to the right by 50px */
}

.rounded-input, .rounded-button {
  width: 70%; /* Set the width to 70% for both */
  border-radius: 20px;
  margin-bottom: 1rem;
  padding: 0.5rem; /* Add padding to make it visually appealing */
  display: flex; /* Use flexbox */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}

.rounded-button {
  min-width: 150px;
  margin-top: 1rem; /* Add margin to separate the button from the text field */
}

.enter-text {
  font-weight: bold; /* Make the button text bold */
  font-size: 20px;
}
</style>
