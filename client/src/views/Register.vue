<template>
  <b-container fluid class="h-100 m-0 p-0 backdrop">
    <b-row no-gutters class="h-100 w-100 justify-content-center">
      <section id="consent-wrapper" class="m-0 w-100">
        <b-col sm="12" md="6" offset-md="3" class="text-center">
          <Messages></Messages>
        </b-col>
        <div class="w-100"></div>
        <div class="h-100 p-5 scrollable backdrop">
          <div>
            <ConsentForm></ConsentForm>
          </div>
        </div>
      </section>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Messages from "@port-of-mars/client/components/dashboard/Messages.vue";
import ConsentForm from "@port-of-mars/client/components/dashboard/Consent.vue";

@Component({
  components: { Messages, ConsentForm }
})
export default class Register extends Vue {}
</script>

<style lang="scss" scoped>
#consent-wrapper {
  padding: 0 0 0 0;
  // background: url("../assets/images/bg-dark-moon.png");
  // background-position: center;
}
</style>
