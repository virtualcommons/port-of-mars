<template>
  <div class="c-footer d-flex flex-row">
    <b-button pill class="footer-button" @click="toggle" :style="button">
      <font-awesome-icon
        v-if="!footer"
        :icon="['fas', 'chevron-circle-up']"
        size="lg"

      />
      <font-awesome-icon
        v-if="footer"
        :icon="['fas', 'chevron-circle-down']"
        size="lg"
      />
    </b-button>

    <footer class="footer d-flex flex-row p-2" :style="show">
      <div class="p-2 footer-copyright">
        &copy; 2020 <a target='_blank' href='https://www.azregents.edu/'>Arizona Board of Regents</a>
      </div>
      <div class="p-2 footer-build">
        Build: {{ buildId }}
      </div>
      <div class="links d-flex">
        <div class="p-2 footer-github">
          <a href="https://github.com/virtualcommons/port-of-mars/" target="_blank">
            <font-awesome-icon
              :icon="['fab', 'github']"
              size="lg"
            />
          </a>
        </div>
        <div class="p-2 footer-mail">
          <a href="mailto:portmars@asu.edu">
            <font-awesome-icon
              :icon="['fas', 'envelope']"
              size="lg"
            />
          </a>
        </div>
        <div class="p-2 footer-license">
          <a href="https://github.com/virtualcommons/port-of-mars/blob/master/LICENSE" target="_blank">
            GNU AGPL v3.0
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import BootstrapVue from 'bootstrap-vue';

  import { getBuildId } from '@port-of-mars/client/settings';

  // FontAwesome icons
  import { library } from '@fortawesome/fontawesome-svg-core';
  import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
  import { faEnvelope} from "@fortawesome/free-solid-svg-icons";
  import { faChevronCircleUp } from '@fortawesome/free-solid-svg-icons/faChevronCircleUp';
  import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons/faChevronCircleDown';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

  library.add(faChevronCircleUp, faChevronCircleDown, faGithub, faEnvelope);

  Vue.use(BootstrapVue);
  Vue.component('font-awesome-icon', FontAwesomeIcon);

  @Component({})
  export default class Footer extends Vue {
    footer = false;
    buildId = '';

    async mounted() {
      this.buildId = await getBuildId();
    }

    private toggle() {
      this.footer = !this.footer;
    }

    get show() {
      return {
        bottom: this.footer ? '0' : '-9rem'
      };
    }

    get button() {
      return {
        bottom: this.footer ? '10rem' : '1rem'
      };
    }
  }
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/global/Footer.scss';
</style>
