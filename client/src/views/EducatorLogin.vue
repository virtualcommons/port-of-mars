<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 backdrop justify-content-center align-items-center">
    <!-- Welcome Page -->
    <div v-if="currentMode === 'welcome'" class="w-100 text-center welcome">
      <div style="margin-top: 35vh">
        <h2 class="mb-4" style="color: var(--light-shade)">
          Welcome to the K-12 version of the Port of Mars
        </h2>
        <h5 class="mb-4">Are you a...</h5>
      </div>
      <div>
        <b-button variant="secondary" class="mx-4" size="lg" @click="setMode('student')">
          <h4>Student</h4>
        </b-button>
        <b-button variant="light" class="mx-2" size="lg" @click="setMode('teacher')">
          <h4>Teacher</h4>
        </b-button>
      </div>
    </div>
    <!-- Main Dynamic Content -->
    <b-container v-else class="content-container p-5" style="max-width: 1100px">
      <div class="d-flex justify-content-left mb-4">
        <b-button variant="outline-primary" @click="setMode('welcome')">
          Return <b-icon-box-arrow-left class="float-left mr-2"></b-icon-box-arrow-left
        ></b-button>
      </div>
      <!-- Student View -->
      <div v-if="currentMode === 'student'">
        <h2 class="text-center mb-4" style="color: var(--light-shade)">Student Sign-In</h2>
        <p class="mb-4" style="color: rgba(255, 255, 255, 0.7); font-size: 1rem; line-height: 1.6">
          <strong>What is Port of Mars?</strong> In Port of Mars, you play as one of five residents
          in Mars' first long-term habitat. You will navigate through several rounds of investing,
          trading, purchasing, and reacting to Mars Events with the goal of achieving as many
          Victory Points as possible while keeping the community alive by maintaining System Health.
          Watch the tutorial video
          <a
            href="https://www.youtube.com/watch?v=D4FfofyrlkA"
            target="_blank"
            style="color: var(--light-shade); text-decoration: underline"
          >
            here
          </a>
          or check out the game manual to learn more.
        </p>
        <p class="mb-4" style="color: rgba(255, 255, 255, 0.7); font-size: 1rem; line-height: 1.6">
          You need to coordinate, cooperate, and compete to do well in the game. These kinds of
          activities are common in many communities on planet Earth when we have to manage shared
          resources. Therefore, this game can be a playful way to learn more about sustainability,
          whether on Earth or beyond.
        </p>
        <div class="d-flex justify-content-center">
          <b-tabs
            active-nav-item-class="font-weight-bold"
            active-tab-class="font-weight-bold"
            content-class="backdrop content-container rounded px-4 py-4 mt-3"
            pills
            class="w-50 text-center"
          >
            <!-- Join a Game Tab -->
            <b-tab title-link-class="small" class="align-items-center">
              <template #title> <b-icon-stars class="mr-1" />Join a game </template>
              <b-form
                @submit.prevent="handleJoinGame"
                class="d-flex flex-column align-items-center"
              >
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
                <b-alert variant="danger" class="mt-5 mb-0 w-100 text-center" v-if="errorMsg" show>
                  {{ errorMsg }}
                </b-alert>
              </b-form>
            </b-tab>
            <!-- Rejoin a Game Tab -->
            <b-tab title-link-class="small">
              <template #title> <b-icon-arrow-clockwise class="mr-1" />Rejoin a game </template>
              <b-form
                @submit.prevent="handleRejoinGame"
                class="d-flex flex-column align-items-center"
              >
                <b-form-input
                  v-model="rejoinCode"
                  type="text"
                  class="w-100 mb-3 text-center"
                  size="lg"
                  placeholder="Rejoin code"
                  @input="clearErrorMsg"
                  required
                ></b-form-input>
                <b-button type="submit" variant="success" rounded class="w-100" size="lg">
                  <h4 class="mb-0">Reconnect</h4>
                </b-button>
                <b-alert variant="danger" class="mt-5 mb-0 w-100 text-center" v-if="errorMsg" show>
                  {{ errorMsg }}
                </b-alert>
              </b-form>
            </b-tab>
          </b-tabs>
        </div>
      </div>
      <!-- Teacher View -->
      <div v-if="currentMode === 'teacher'">
        <h2 class="text-center mb-4" style="color: var(--light-shade)">Teacher Sign-In</h2>
        <p class="mb-4" style="color: rgba(255, 255, 255, 0.7); font-size: 1rem; line-height: 1.6">
          <strong>Welcome to the K-12 version of the Port of Mars.</strong> This version is designed
          to be an educational experience for students and does not collect data for research
          purposes. The original version is intended for players 18 years and older, where data is
          collected to support research studies.
        </p>
        <p class="mb-4" style="color: rgba(255, 255, 255, 0.7); font-size: 1rem; line-height: 1.6">
          For teachers, we also provide lesson materials that teachers may use in their curriculum
          when using Port of Mars.
        </p>
        <p class="mb-4" style="color: rgba(255, 255, 255, 0.7); font-size: 1rem; line-height: 1.6">
          Teachers can create an account by sending us an email at
          <a
            href="mailto:portmars@asu.edu"
            style="color: var(--light-shade); text-decoration: underline"
          >
            portmars@asu.edu
          </a>
          . Please use your email address from your school so we can verify you are a K-12 teacher.
        </p>
        <div class="d-flex justify-content-center">
          <b-tabs
            active-nav-item-class="font-weight-bold"
            active-tab-class="font-weight-bold"
            content-class="backdrop content-container rounded px-4 py-4 mt-3"
            pills
            class="w-50 mt-4 text-center"
          >
            <!-- Teacher Login Tab -->
            <b-form
              @submit.prevent="handleTeacherLogin"
              class="d-flex flex-column align-items-center"
            >
              <b-form-input
                v-model="username"
                placeholder="Enter Username"
                class="w-100 mb-3 text-center"
                @input="clearErrorMsg"
                required
              />
              <b-form-input
                v-model="password"
                type="password"
                placeholder="Enter Password"
                class="w-100 mb-3 text-center"
                @input="clearErrorMsg"
                required
              />
              <b-button type="submit" variant="success" rounded class="w-100" size="lg">
                <h4 class="mb-0">Login</h4>
              </b-button>
              <b-alert variant="danger" class="mt-5 mb-0 w-100 text-center" v-if="errorMsg" show>
                {{ errorMsg }}
              </b-alert>
            </b-form>
          </b-tabs>
        </div>
      </div>
    </b-container>
  </b-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { AuthAPI } from "@port-of-mars/client/api/auth/request";
@Component
export default class LoginView extends Vue {
  authApi!: AuthAPI;
  currentMode = "welcome";
  gameCode = "";
  rejoinCode = "";
  username = "";
  password = "";
  errorMsg = "";
  created() {
    this.authApi = new AuthAPI(this.$store, this.$ajax, this.$router);
  }
  setMode(mode: string) {
    this.currentMode = mode;
  }
  clearErrorMsg() {
    this.errorMsg = "";
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
}
</script>
<style lang="scss" scoped>
.welcome {
  height: 100%;
  background: url("../assets/images/stars-bg.jpg") no-repeat;
  background-attachment: fixed;
}
</style>
