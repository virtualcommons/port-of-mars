<!-- 
HTML Document by Christina Carrasquilla for Port of Mars (POM)
ccarra1@asu.edu
-->
<template>
  <b-container class="m-0 p-0" style="background-color: var(--dark-shade-75)" fluid>
    <footer>
      <!-- FIXME: nav links should change based on the route -->
      <section id="footer-nav">
        <h2>Navigation</h2>
        <ul>
          <li>
            <a href="/#/#about" title="about">About</a>
          </li>
          <li>
            <a href="/#/#leaderboard" title="leaderboard">Leaderboard</a>
          </li>
          <li>
            <a href="/#/#news" title="news">News</a>
          </li>
          <li>
            <a href="/#/#gameplay" title="gameplay">Gameplay</a>
          </li>
        </ul>
      </section>
      <section id="sponsors">
        <h2>Sponsors</h2>
        <ul>
          <li>
            <a href="https://interplanetary.asu.edu/" title="ASU Interplanetary Initiative"
              >ASU Interplanetary Initiative</a
            >
          </li>
          <li>
            <a href="https://complexity.asu.edu/" title="ASU School of Complex Adaptive Systems"
              >ASU School of Complex Adaptive Systems</a
            >
          </li>
          <li></li>
            <a href="https://www.nsf.gov/" title="US National Science Foundation"
              >US National Science Foundation (SES-2049553)</a
            >
          </li>
        </ul>
      </section>
      <section id="social-media">
        <h2>Connect with Us</h2>
        <ul>
          <li>
            <a href="mailto:portmars@asu.edu" title="Email us"
              >Email
              <b-icon icon="envelope" class="mx-1"></b-icon>
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/portofmars/" title="Instagram">Instagram </a>
            <b-icon icon="instagram" class="mx-1"></b-icon>
          </li>
          <li>
            <a href="https://twitter.com/PortOfMars" title="Twitter"
              >Twitter
              <b-icon icon="twitter" class="mx-1"></b-icon>
            </a>
          </li>
        </ul>
      </section>
      <div id="copyright">
        <small>&copy; 2020-{{ currentYear }} Arizona Board of Regents
        <br />
        <a href="https://github.com/virtualcommons/port-of-mars">{{ buildId }}</a>
        </small>
      </div>
    </footer>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BootstrapVue from "bootstrap-vue";
import { BUILD_ID } from "@port-of-mars/shared/settings";
Vue.use(BootstrapVue);

@Component({})
export default class Footer extends Vue {
  buildId = "";
  currentYear = new Date().getFullYear();

  async mounted() {
    this.buildId = BUILD_ID;
  }
}
</script>
