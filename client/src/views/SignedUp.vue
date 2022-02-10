<template>
  <b-container class="bg-dark-75 h-100" fluid>
    <Header></Header>
    <b-row class="h-50 mt-5">
      <b-col class="text-center">
        <h1>Thank you for signing up for the Mars Madness tournament!</h1>
        <h3 class="m-4">
          When we're ready to launch, we will send you an email with additional instructions.
        </h3>
        <!-- <b-button variant="outline-success" class="mx-3" to="tutorial">Take the Tutorial</b-button> -->
        <b-button size="lg" squared variant="primary" @click="logout">Log Out</b-button>
      </b-col>
    </b-row>
    <Footer></Footer>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { LOGIN_PAGE, TUTORIAL_PAGE } from "@port-of-mars/shared/routes";
import Header from "@port-of-mars/client/components/global/Header.vue";
import Footer from "@port-of-mars/client/components/global/Footer.vue";

@Component({
  components: {
    Footer,
    Header
  }
})
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
