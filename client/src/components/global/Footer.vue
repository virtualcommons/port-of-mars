<template>
  <b-container class="p-3" style="background-color: var(--dark-shade-75)" fluid>
    <b-row>
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

      <b-col class="mr-auto text-center">
        This material is based upon work sponsored by ASU Interplanetary Initiative, ASU School of
        Complex Adaptive Systems, and National Science Foundation.
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
        <!-- github -->
        <a href="https://github.com/virtualcommons/port-of-mars/" target="_blank">
          <font-awesome-icon :icon="['fab', 'github']" size="lg" />
        </a>
      </b-col>

      <b-col cols="auto">
        &copy; 2021
        <a href="https://www.azregents.edu/" target="_blank">Arizona Board of Regents</a>
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

  async mounted() {
    this.buildId = BUILD_ID;
  }
}
</script>
