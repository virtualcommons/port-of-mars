<template>
  <b-container class="p-0 m-0 w-100" fluid>
    <b-row class="m-2">
      <!-- build id -->
      <b-col cols="auto">
        Build: {{ buildId }}
      </b-col>

      <!-- license -->
      <b-col cols="auto">
        <a href="https://github.com/virtualcommons/port-of-mars/blob/master/LICENSE"
           target="_blank">
          GNU AGPL v3.0
        </a>
      </b-col>

      <b-col class="mr-auto text-center">
        This material is based upon work supported by the National Science Foundation, Compute Canada,
        ASU Interplanetary Initiative, and ASU Biosocial Complexity Initiative.
      </b-col>

      <!-- github -->
      <b-col cols="auto">
        <a href="https://github.com/virtualcommons/port-of-mars/" target="_blank">
          <font-awesome-icon
            :icon="['fab', 'github']"
            size="lg"
          />
        </a>
      </b-col>

      <!-- email -->
      <b-col cols="auto">
        <a href="mailto:portmars@asu.edu">
          <font-awesome-icon
            :icon="['fas', 'envelope']"
            size="lg"
          />
        </a>
      </b-col>
      <b-col cols="auto">
        &copy; 2021 <a href='https://www.azregents.edu/' target='_blank'>Arizona Board of
        Regents</a>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import BootstrapVue from 'bootstrap-vue';

// FontAwesome icons
import {library} from '@fortawesome/fontawesome-svg-core';
import {faGithub} from '@fortawesome/free-brands-svg-icons/faGithub';
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {BUILD_ID} from "@port-of-mars/shared/settings";

library.add(faGithub, faEnvelope);
Vue.use(BootstrapVue);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({})
export default class Footer extends Vue {
  buildId = '';

  async mounted() {
    this.buildId = BUILD_ID;
  }
}
</script>
