<template>
  <b-container fluid class="h-100 m-0 p-0 backdrop">
    <Messages class="position-fixed p-3"></Messages>
    <b-row no-gutters class="h-100 w-100 justify-content-center">
      <section id="consent-wrapper" class="m-0 h-100 w-100">
        <div class="w-100"></div>
        <div class="h-100 p-5 backdrop">
          <div class="h-100 content-container">
            <ConsentForm></ConsentForm>
          </div>
        </div>
      </section>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Messages from "@port-of-mars/client/components/global/Messages.vue";
import ConsentForm from "@port-of-mars/client/components/global/Consent.vue";

@Component({
  components: { Messages, ConsentForm },
})
export default class Register extends Vue {}
</script>

<style lang="scss" scoped></style>
