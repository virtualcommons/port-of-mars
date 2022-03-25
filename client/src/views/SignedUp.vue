<template>
  <b-container fluid class="h-100 m-0 p-0">
    <b-row no-gutters class="h-100 w-100">
      <section id="signed-up-wrapper" class="h-100 w-100 text-center">
        <div class="mx-5 p-5" id="signed-up-container">
          <h1>Thank you for signing up for the Mars Madness tournament!</h1>
          <h3 class="m-4">
            When we're ready to launch, we will send you an email with additional instructions.
          </h3>
          <!-- <b-button variant="outline-success" class="mx-3" to="tutorial">Take the Tutorial</b-button> -->
          <b-button size="lg" squared variant="primary" @click="signout"
            ><h4>Sign Out</h4></b-button
          >
        </div>
      </section>
      <Footer></Footer>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { LOGIN_PAGE, TUTORIAL_PAGE } from "@port-of-mars/shared/routes";
import Footer from "@port-of-mars/client/components/global/Footer.vue";

@Component({
  components: { Footer }
})
export default class SignedUp extends Vue {
  get tutorial() {
    return { name: TUTORIAL_PAGE };
  }

  signout() {
    this.$ajax.forgetLoginCreds();
    this.$router.push({ name: LOGIN_PAGE });
  }
}
</script>

<style lang="scss" scoped>
p {
  color: var(--white);
}

#signed-up-wrapper {
  padding: 250px 0 250px 0;
  background: url("../assets/images/bg-dark-moon.png");
  background-position: center;
}

#signed-up-container {
  background-color: var(--dark-shade-75);
}
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
