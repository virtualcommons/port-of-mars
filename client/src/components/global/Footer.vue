<template>
  <b-container class="w-100 p-3" style="background-color: var(--dark-shade-75)" fluid>
    <b-row align-h="center">
      <!-- build id -->
      <b-col cols="auto"> Build: {{ buildId }} </b-col>

      <!-- license -->
      <b-col cols="auto">
        <a
          href="https://github.com/virtualcommons/port-of-mars/blob/master/LICENSE"
          target="_blank"
        >
          GNU AGPL v3.0
        </a>
      </b-col>

      <!-- instagram -->
      <b-col cols="auto">
        <a href="https://www.instagram.com/portofmars/" target="_blank">
          <font-awesome-icon :icon="['fab', 'instagram']" size="lg" />
        </a>
      </b-col>

      <!-- facebook -->
      <b-col cols="auto">
        <a href="https://www.facebook.com/Port-of-Mars-278162624025157" target="_blank">
          <font-awesome-icon :icon="['fab', 'facebook']" size="lg" />
        </a>
      </b-col>

      <!-- twitter -->
      <b-col cols="auto">
        <a href="https://twitter.com/PortOfMars" target="_blank">
          <font-awesome-icon :icon="['fab', 'twitter']" size="lg" />
        </a>
      </b-col>

      <!-- email -->
      <b-col cols="auto">
        <a href="mailto:portmars@asu.edu" target="_blank">
          <font-awesome-icon :icon="['fas', 'envelope']" size="lg" />
        </a>
      </b-col>
      <b-col cols="auto">
        <a href="https://www.azregents.edu/" target="_blank">
          &copy; 2020 - {{ currentYear }} Arizona Board of Regents
        </a>
      </b-col>
    </b-row>
    <b-row align-h="center">
      <b-col cols="auto">
        <small>
          This material is based on work sponsored by the
          <a href="https://interplanetary.asu.edu">ASU Interplanetary Initiative</a>,
          <a href="https://complexity.asu.edu">ASU School of Complex Adaptive Systems</a>, and the
          <a href="https://www.nsf.gov">US National Science Foundation (SES-2049553)</a>.
        </small>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BootstrapVue from "bootstrap-vue";

// FontAwesome icons
import { library } from "@fortawesome/fontawesome-svg-core";
import { faGithub, faTwitter, faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { BUILD_ID } from "@port-of-mars/shared/settings";

library.add(faGithub, faEnvelope, faTwitter, faFacebook, faInstagram);
Vue.use(BootstrapVue);
Vue.component("font-awesome-icon", FontAwesomeIcon);

@Component({})
export default class Footer extends Vue {
  buildId = "";
  currentYear = new Date().getFullYear();

  async mounted() {
    this.buildId = BUILD_ID;
  }
}
</script>
