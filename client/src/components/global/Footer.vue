<!-- 
Footer designed by Christina Carrasquilla for Port of Mars
ccarra1@asu.edu
-->
<template>
  <b-container class="mt-3 p-2 footer-container" fluid>
    <footer id="pom-footer">
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
          <li>
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
        &copy; 2020-{{ currentYear }} 
          <a href="https://www.azregents.edu/">Arizona Board of Regents</a> | 

          <a href="https://github.com/virtualcommons/port-of-mars">{{ buildId }}</a>
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

<style>
.footer-container {
  background-color: var(--dark-shade-75);
  display: flex;
  align-items: flex-end;
  flex-direction: row-reverse;
  justify-content: center;
}

footer {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
}
footer section {
  margin: 0 auto;
}
#copyright {
  grid-column: 1/4;
  padding: 1rem;
  text-align: center;
  width: 100%;
}

/* ------------------- POM TEXT STYLES -------------------  */
footer {
  font-size: 1em;
  padding: 1rem;
}
footer a,
footer a:link,
footer a:visited,
footer a:active {
  color: var(--white);
  text-decoration: none;
  transition: all 0.5s cubic-bezier(0.75, 0.5, 0.05, 1);
}
footer a:hover {
  color: var(--red);
}
footer ul {
  padding: 1rem;
}
#footer-nav h2,
#sponsors h2,
#social-media h2 {
  text-align: left;
}
#footer-nav h2,
#sponsors h2,
#social-media h2 {
  font-size: 1.5em;
  padding: 1rem;
}
@media screen and (max-width: 810px) {
  footer {
    grid-template-columns: 1fr;
  }
  footer section {
    grid-column: 1/2;
    margin: 5px;
  }
}
</style>