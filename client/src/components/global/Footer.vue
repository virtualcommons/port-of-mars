<template>
  <footer :style="show" class="footer">
    <b-container class="p-0 m-0" fluid>
      <b-row class="p2">
        <!-- copyright -->
        <b-col>
          <p>&copy; 2020 <a href='https://www.azregents.edu/' target='_blank'>Arizona Board of
          Regents</a></p>
        </b-col>

        <!-- build id -->
        <b-col>
          <p>Build: {{ buildId }}</p>
        </b-col>

        <!-- github -->
        <b-col>
          <a href="https://github.com/virtualcommons/port-of-mars/" target="_blank">
            <font-awesome-icon
              :icon="['fab', 'github']"
              size="lg"
            />
          </a>
        </b-col>
        
        <!-- email -->
        <b-col>
          <a href="mailto:portmars@asu.edu">
            <font-awesome-icon
              :icon="['fas', 'envelope']"
              size="lg"
            />
          </a>
        </b-col>

        <!-- license -->
        <b-col>
          <a href="https://github.com/virtualcommons/port-of-mars/blob/master/LICENSE"
            target="_blank">
            GNU AGPL v3.0
          </a>
        </b-col>
      </b-row>
  <!-- <div class="d-flex flex-row">
    
      <div class="p-2 align-self-center">
        <img
          :src="
      require(`@port-of-mars/client/assets/sponsors/compute_canada.png`)
    "
          alt="Compute Canada"
          class="compute-canada"
        />
      </div>
      <div class="p-2 align-self-center">
        <img
          :src="
      require(`@port-of-mars/client/assets/sponsors/asu_gbci.png`)
    "
          alt="ASU Global Biosocial Complexity Initiative"
          class="gbci"
        />
      </div>
      <div class="p-2 align-self-center">
        <img
          :src="
      require(`@port-of-mars/client/assets/sponsors/asu_interplanetary_initiative.png`)
    "
          alt="ASU Interplanetary Initative"
          class="ii"
        />
      </div>
  </div> -->
    </b-container>
  </footer>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import BootstrapVue from 'bootstrap-vue';

  // FontAwesome icons
  import {library} from '@fortawesome/fontawesome-svg-core';
  import {faGithub} from '@fortawesome/free-brands-svg-icons/faGithub';
  import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
  import {faChevronCircleUp} from '@fortawesome/free-solid-svg-icons/faChevronCircleUp';
  import {faChevronCircleDown} from '@fortawesome/free-solid-svg-icons/faChevronCircleDown';
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
  import {BUILD_ID} from "@port-of-mars/shared/settings";

  library.add(faChevronCircleUp, faChevronCircleDown, faGithub, faEnvelope);

  Vue.use(BootstrapVue);
  Vue.component('font-awesome-icon', FontAwesomeIcon);

  @Component({})
  export default class Footer extends Vue {
    footer = false;
    buildId = '';

    get show() {
      return {
        bottom: this.footer ? '0' : '-15rem'
      };
    }

    get button() {
      return {
        bottom: this.footer ? '16rem' : '1rem'
      };
    }

    async mounted() {
      this.buildId = BUILD_ID;
    }

    private toggle() {
      this.footer = !this.footer;
    }
  }
</script>

<style lang="scss" scoped>
  @import '@port-of-mars/client/stylesheets/global/Footer.scss';
</style>
