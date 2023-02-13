<!-- 
Footer designed by Christina Carrasquilla for Port of Mars
ccarra1@asu.edu
-->
<template>
  <!-- <b-container class="m-0 p-3 footer-container" fluid> -->
  <footer class="footer-container p-5 w-100">
    <section id="footer-nav">
      <h2>Navigation</h2>
      <ul>
        <li>
          <b-link :to="login" title="Sign up or login">Sign In</b-link>
        </li>
        <li>
          <b-link :to="lobby" title="Play Port of Mars">Game Lobby</b-link>
        </li>
        <li>
          <b-link :to="manual" title="User Manual">How to Play</b-link>
        </li>
        <li>
          <b-link :to="privacy" title="Privacy Policy">Privacy Policy</b-link>
        </li>
        <li>
          <b-link :to="consent" title="Player Consent Form">Consent Form</b-link>
        </li>
      </ul>
    </section>
    <section id="sponsors">
      <h2>Sponsors</h2>
      <ul>
        <li>
          <a href="https://interplanetary.asu.edu/" title="ASU Interplanetary Initiative">
            ASU Interplanetary Initiative
          </a>
        </li>
        <li>
          <a href="https://scas.asu.edu/" title="ASU School of Complex Adaptive Systems">
            ASU School of Complex Adaptive Systems
          </a>
        </li>
        <li>
          <a href="https://www.nsf.gov/" title="US National Science Foundation">
            US National Science Foundation (SES-2049553)</a
          >
        </li>
        <li>
          <a href="https://alliancecan.ca/en" title="Digital Research Alliance of Canada">
            Digital Research Alliance of Canada
          </a>
        </li>
      </ul>
    </section>
    <section id="social-media">
      <h2>Connect with Us</h2>
      <ul>
        <li>
          <a :href="constants.DISCORD_URL" title="Discord">
            Discord
            <b-icon-discord></b-icon-discord>
          </a>
        </li>
        <li>
          <a :href="'mailto:' + constants.CONTACT_EMAIL" title="Email us">
            Email
            <b-icon-envelope class="mx-1"></b-icon-envelope>
          </a>
        </li>
        <li>
          <a :href="constants.INSTAGRAM_URL" title="Instagram">
            Instagram
            <b-icon-instagram class="mx-1"></b-icon-instagram>
          </a>
        </li>
        <li>
          <a :href="constants.TWITTER_URL" title="Twitter">
            Twitter
            <b-icon-twitter class="mx-1"></b-icon-twitter>
          </a>
        </li>
      </ul>
    </section>
    <div id="copyright">
      &copy; 2020-{{ currentYear }}
      <a href="https://www.azregents.edu/">Arizona Board of Regents</a> |

      <a :href="constants.GITHUB_URL">{{ constants.BUILD_ID }}</a>
    </div>
  </footer>
  <!-- </b-container> -->
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Constants } from "@port-of-mars/shared/settings";
import {
  LOGIN_PAGE,
  LOBBY_PAGE,
  REGISTER_PAGE,
  MANUAL_PAGE,
  PRIVACY_PAGE,
} from "@port-of-mars/shared/routes";

@Component({})
export default class Footer extends Vue {
  currentYear = new Date().getFullYear();
  consent = { name: REGISTER_PAGE };
  manual = { name: MANUAL_PAGE };
  login = { name: LOGIN_PAGE };
  lobby = { name: LOBBY_PAGE };
  privacy = { name: PRIVACY_PAGE };

  get constants() {
    return Constants;
  }
}
</script>

<style lang="scss" scoped>
.footer-container {
  background-color: var(--dark-shade-75);
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

footer li {
  margin: 0.5rem 0 0.5rem 0;
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
  padding-bottom: 2px;
  border-bottom: 3px solid var(--red);
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
