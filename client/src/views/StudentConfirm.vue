<template>
  <b-container fluid class="h-100 w-100 d-flex flex-column justify-content-center align-items-center backdrop">
    <!-- Display generated username -->
    <h3 class="mb-3">Your username is: {{ username }}</h3>
    
    <div id="confirm-container" class="content-container rounded d-flex flex-column justify-content-center align-items-center backdrop px-0">
      <!-- First Name Input -->
      <b-form-input
        v-model="firstName"
        class="w-70 mb-3 text-center"
        size="lg"
        placeholder="FIRST NAME"
        required
      ></b-form-input>
      
      <!-- Last Name Input -->
      <b-form-input
        v-model="lastName"
        class="w-70 mb-3 text-center"
        size="lg"
        placeholder="LAST NAME"
        required
      ></b-form-input>

    <!-- Password Display Section -->
    <div style="width: 70%; display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 1rem; margin-top: 1rem;">
      <div style="border: 1px solid #e6dbac; padding: .75rem 1.25rem; font-size: 1.25rem; background-color: transparent; width: 100%;" class="rounded text-center">
        PASSWORD: {{ password }}
      </div>
      <div style="font-size: 1.2rem; font-weight: bold; margin-top: .5rem;">
        Write down this passcode to rejoin
      </div>
    </div>

      <!-- Join Class Lobby Button -->
      <b-button
        variant="primary"
        rounded
        @click="joinClassLobby"
        class="w-70"
        size="lg"
      >
        <h4 class="mb-0">Join Class Lobby</h4>
      </b-button>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class StudentConfirm extends Vue {
  firstName: string = "";
  lastName: string = "";
  username: string = ""; 
  password: string = ""; 

  joinClassLobby() {
    console.log("Join Class Lobby button clicked");
  }

  created() {
  }
}
</script>

<style lang="scss" scoped>
#confirm-container {
  padding: 2rem;
  width: 30rem;
  text-align: center;
}
</style>
