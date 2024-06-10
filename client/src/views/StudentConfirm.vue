<template>
  <b-container
    fluid
    class="h-100 w-100 d-flex flex-column justify-content-center align-items-center backdrop"
  >
    <!-- Display generated username -->
    <h3 class="mb-3">Your username is: {{ username }}</h3>

    <div
      id="confirm-container"
      class="content-container rounded d-flex flex-column justify-content-center align-items-center backdrop px-0"
    >
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
      <!-- FIXME: replace with util classes -->
      <div
        style="
          width: 70%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 1rem;
          margin-top: 1rem;
        "
      >
        <div
          style="
            border: 1px solid #e6dbac;
            padding: 0.75rem 1.25rem;
            font-size: 1.25rem;
            background-color: transparent;
            width: 100%;
          "
          class="rounded text-center"
        >
          PASSWORD: {{ rejoinCode }}
        </div>
        <div style="font-size: 1.2rem; font-weight: bold; margin-top: 0.5rem">
          Write down this passcode to rejoin
        </div>
      </div>

      <!-- Join Class Lobby Button -->
      <b-button variant="primary" rounded @click="handleSubmit" class="w-70" size="lg">
        <h4 class="mb-0">Join Class Lobby</h4>
      </b-button>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { EducatorAPI } from "@port-of-mars/client/api/educator/request";
import { CLASSROOM_LOBBY_PAGE, STUDENT_LOGIN_PAGE } from "@port-of-mars/shared/routes";

@Component
export default class StudentConfirm extends Vue {
  educatorApi: EducatorAPI = new EducatorAPI(this.$store, this.$ajax);
  firstName: string = "";
  lastName: string = "";
  rejoinCode: string = "placeholder";

  get username() {
    return this.$tstore.state.user.username;
  }

  async handleSubmit() {
    try {
      await this.educatorApi.confirmStudent({
        name: `${this.firstName} ${this.lastName}`,
      });
      this.$router.push({ name: CLASSROOM_LOBBY_PAGE });
    } catch (e) {
      console.error(e);
    }
  }

  async created() {
    const data = await this.educatorApi.authStudent();
    if (!data) {
      this.$router.push({ name: STUDENT_LOGIN_PAGE });
    } else {
      this.rejoinCode = data.rejoinCode;
    }
  }
}
</script>

<style lang="scss" scoped>
// FIXME: ideally replace with util classes
#confirm-container {
  padding: 2rem;
  width: 30rem;
  text-align: center;
}
</style>
