<template>
  <b-container class="h-100 p-0 m-0" fluid>
    <b-row no-gutters align-v="stretch" align-h="center" class="w-100 h-100">
      <b-row class="w-100" align-v="center" align-h="center">
        <b-col cols="8">
          <Messages></Messages>
        </b-col>
      </b-row>
      <b-row class="w-100" align-v="center" align-h="center">
        <b-col cols="10">
          <ConsentForm></ConsentForm>
        </b-col>
      </b-row>
      <b-row class="w-100" align-v="end" align-h="end">
        <Footer></Footer>
      </b-row>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Messages from "@port-of-mars/client/components/dashboard/Messages.vue";
import ConsentForm from "@port-of-mars/client/components/dashboard/Consent.vue";
import Footer from "@port-of-mars/client/components/global/Footer.vue";

@Component({
  components: { Messages, ConsentForm, Footer }
})
export default class Register extends Vue {}
</script>
