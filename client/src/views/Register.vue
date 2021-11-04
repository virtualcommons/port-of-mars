<template>
  <b-container fluid>
    <Header title="Consent Form and Registration">
      <template v-slot:nav-items>
        <b-nav-item :to="dashboard">Dashboard</b-nav-item>
      </template>
    </Header>
    <Messages></Messages>
    <ConsentForm></ConsentForm>
    <Footer></Footer>
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

  dashboard = { name: DASHBOARD_PAGE};

}
</script>
