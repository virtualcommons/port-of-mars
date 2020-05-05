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
      <div class="p-2 footer-build">
        v2020.04.2-alpha
      </div>
      <div class="p-2 footer-copyright">
        Copyright © 2020 Global Biosocial Complexity Initiative
      </div>
      <div class="p-2 footer-license">
        <a href="https://github.com/virtualcommons/port-of-mars/blob/master/LICENSE" style="text-decoration: underline">License</a>
      </div>
      <div class="p-2 footer-github">
        <a href="https://github.com/virtualcommons/port-of-mars/" style="text-decoration: underline">GitHub</a>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import BootstrapVue from 'bootstrap-vue';

  // FontAwesome icons
  import { library } from '@fortawesome/fontawesome-svg-core';
  import { faChevronCircleUp } from '@fortawesome/free-solid-svg-icons/faChevronCircleUp';
  import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons/faChevronCircleDown';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

  library.add(faChevronCircleUp, faChevronCircleDown);

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
