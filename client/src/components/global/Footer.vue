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
        Copyright © 2020 Port of Mars
      </div>
      <div class="p-2 footer-build">
        Build: v2020.04.2
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
    footer: boolean = false;

    private toggle() {
      this.footer = !this.footer;
      console.log('toggle: ', this.footer);
      return this.footer;
    }

    get show() {
      return this.footer
        ? { bottom: '0' }
        : { bottom: '-9rem' };
    }

    get button() {
      return this.footer
      ? { bottom: '10rem' }
      : { bottom: '1rem' };
    }
  }
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/global/Footer.scss';
</style>
