<template>
  <b-container fluid class="d-flex flex-column h-100 m-0 p-0 bg-dark-75">
    <!-- <b-row class="d-flex flex-column h-100 w-100 m-0"> -->
    <b-row>
      <Header title="Consent Form and Registration">
        <template v-slot:nav-items>
          <b-nav-item :to="dashboard">Dashboard</b-nav-item>
        </template>
      </Header>
    </b-row>
    <b-row>
      <Messages></Messages>
    </b-row>
    <b-row class="flex-grow-1">
      <b-col class="m-3">
        <div class="h-100 p-3 scrollable backdrop">
          <ConsentForm></ConsentForm>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <Footer></Footer>
    </b-row>
    <!-- </b-row> -->
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Messages from "@port-of-mars/client/components/dashboard/Messages.vue";
import ConsentForm from "@port-of-mars/client/components/dashboard/Consent.vue";
import Header from "@port-of-mars/client/components/global/Header.vue";
import Footer from "@port-of-mars/client/components/global/Footer.vue";

import { DASHBOARD_PAGE } from "@port-of-mars/shared/routes";

@Component({
  components: { Header, Messages, ConsentForm, Footer }
})
export default class Register extends Vue {
  dashboard = { name: DASHBOARD_PAGE };
}
</script>
