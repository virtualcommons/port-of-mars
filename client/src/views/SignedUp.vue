<template>
  <b-container class="m-0 p-0 h-100" fluid>
    <!-- BACKGROUND -->
    <img
      :src="require(`@port-of-mars/client/assets/marsbg.jpg`)"
      alt="Background Image"
      class="background-image h-100 w-100"
    />

    <b-row align-v="center" class="h-75 w-100">
      <b-col cols="auto" class="mr-auto">
        <img
          :src="
          require(`@port-of-mars/client/assets/characters-large/Researcher.png`)
        "
          alt="Researcher Role"
          class="researcher"
        />
      </b-col>

      <b-col class="text-center">
        <h1>Thank you for signing up for the next <em>Port Of Mars</em> Mars Madness tournament!</h1>
        <p>When we're ready to launch we will send you an email with additional instructions.</p>
        <b-button size="lg" class="my-3" variant="outline-warning" @click="logout">Logout</b-button>
      </b-col>

      <b-col cols="auto"  >
        <img
          :src="
          require(`@port-of-mars/client/assets/characters-large/Entrepreneur.png`)
        "
          alt="Entrepreneur Role"
          class="entrepreneur"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {LOGIN_PAGE} from "@port-of-mars/shared/routes";

@Component({})
export default class SignedUp extends Vue {
  logout() {
    this.$ajax.forgetLoginCreds();
    this.$router.push({ name: LOGIN_PAGE });
  }
}
</script>

<style lang="scss" scoped>
.background-image {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0.0625;
}

.researcher, .entrepreneur {
  //position: absolute;
  height: 40vh;
  top: 10vh;
}

</style>
