<template>
  <b-container
    fluid
    class="h-100 w-100 d-flex flex-column justify-content-center align-items-center backdrop"
  >
    <b-form
      class="content-container rounded d-flex flex-column justify-content-center align-items-center backdrop p-5"
      style="width: 30rem"
      @submit.stop.prevent="handleSubmit"
    >
      <h4>Welcome, {{ username }}</h4>
      <p class="mb-4">
        Please enter the identifier given to you by your teacher to continue to the classroom lobby
      </p>
      <b-form-input
        v-model="identifier"
        class="w-100 mb-3 text-center"
        size="lg"
        placeholder="Identifier"
        required
      ></b-form-input>
      <p class="mt-3">
        Write down the code below in order to rejoin the classroom in case you get disconnected
      </p>
      <div class="input-group mb-5">
        <input
          type="text"
          class="form-control bg-dark font-weight-bold border-secondary text-center"
          v-model="rejoinCode"
          disabled
        />
        <div class="input-group-append">
          <button class="btn btn-secondary" type="button" @click="copyRejoinCode">copy</button>
        </div>
      </div>
      <b-button
        type="submit"
        :disabled="!isFormValid"
        variant="success"
        rounded
        class="w-100"
        size="lg"
      >
        <h4 class="mb-0">Enter Lobby</h4>
      </b-button>
    </b-form>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { EducatorAPI } from "@port-of-mars/client/api/educator/request";
import { CLASSROOM_LOBBY_PAGE, EDUCATOR_LOGIN_PAGE } from "@port-of-mars/shared/routes";

@Component
export default class StudentConfirm extends Vue {
  educatorApi: EducatorAPI = new EducatorAPI(this.$store, this.$ajax);

  identifier = "";
  rejoinCode = "";
  confirmedRejoinCode = false;

  get username() {
    return this.$tstore.state.user.username;
  }

  get isFormValid() {
    return this.identifier.trim() !== "";
  }

  async handleSubmit() {
    try {
      await this.educatorApi.confirmStudent({
        name: this.identifier,
      });
      this.$router.push({ name: CLASSROOM_LOBBY_PAGE });
    } catch (e) {
      console.error("Error in handle submit in confirm:", e);
    }
  }

  async created() {
    const data = await this.educatorApi.authStudent();
    if (!data) {
      this.$router.push({ name: EDUCATOR_LOGIN_PAGE });
    } else {
      this.rejoinCode = data.rejoinCode;
    }
  }

  copyRejoinCode() {
    navigator.clipboard.writeText(this.rejoinCode);
  }
}
</script>

<style lang="scss" scoped></style>
