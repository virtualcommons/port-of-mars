<template>
  <b-container class="h-100" fluid style="background-color: var(--dark-shade-75)">
    <b-row align-h="center" align-v="center" class="h-100 w-100 text-center">
      <b-col align-self="center">
        <h1>Thank you for signing up for the Mars Madness tournament!</h1>
        <h3 class="m-4">
          When we're ready to launch, we will send you an email with additional instructions.
        </h3>
        <!-- <b-button variant="outline-success" class="mx-3" :to="tutorial">Take the Tutorial</b-button> -->
        <b-button size="lg" squared variant="primary" @click="logout">Log Out</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { LOGIN_PAGE, TUTORIAL_PAGE } from "@port-of-mars/shared/routes";

@Component({})
export default class SignedUp extends Vue {
  get tutorial() {
    return { name: TUTORIAL_PAGE };
  }

  logout() {
    this.$ajax.forgetLoginCreds();
    this.$router.push({ name: LOGIN_PAGE });
  }
}
</script>

<style lang="scss" scoped>
h1,
h3 {
  color: white;
}

.subtitle {
  font-size: 2rem;
  font-weight: 500;
  color: white;
}
</style>
