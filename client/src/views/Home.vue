<template>
  <b-container fluid class="h-100">
    <header>
      <img
        id="logo"
        src="../assets/images/logo-Port-of-Mars-White.svg"
        alt="the planet mars illustrated in white above Port of Mars"
      />
      <h1 class="hidden">Port of Mars</h1>
      <nav>
        <h2 class="hidden">Main Navigation</h2>
        <div id="nav-mobile">
          <input type="checkbox" />
          <span></span>
          <span></span>
          <span></span>
          <ul id="nav">
            <li><a href="#about" title="about">About</a></li>
            <li><a href="#winners" title="winners">Winners</a></li>
            <li><a href="#news" title="news">News</a></li>
            <li><a href="#gameplay" title="gameplay">Gameplay</a></li>
            <li><a href="sign-up" title="sign-up">Sign Up</a></li>
            <li><a href="log-in" title="log-in">Log In</a></li>
          </ul>
        </div>
      </nav>
    </header>
    <main>
      <section id="about">
        <h2>About Port of Mars</h2>
        <p>
          Port of Mars is an online, game-based, social science experiment set on the first human
          community on the Red Planet. Currently recruiting Arizona State University Undergraduates
          for game play.
        </p>
      </section>
      <section id="stats">
        <h3 class="hidden">Game Stats</h3>
        <table>
          <thead>
            <tr>
              <th>Teams Survived</th>
              <th>Teams Collapsed</th>
              <th>Next Game</th>
            </tr>
            <tr>
              <td>38</td>
              <td>34</td>
              <td>Spring 2022</td>
            </tr>
          </thead>
        </table>
      </section>
      <section id="game-trailer">
        <div>
          <h3>The Game</h3>
          <p>
            You are 1 of 5 residents at the Port of Mars, the first long-term habitat on the planet.
            Each game consists of 8 —12 rounds, each with phases of investing, trading, purchasing,
            discarding, and reacting to Mars events. Chance and player actions impact system health.
            If system health falls to zero all players die.
          </p>
        </div>
        <div>
          <iframe
            title="vimeo-player"
            src="https://player.vimeo.com/video/644046830?h=0e08b0112c"
            width="640"
            height="360"
            allowfullscreen
          ></iframe>
        </div>
      </section>
      <section id="winners">
        <h2>Winners</h2>
        <section>
          <h3>Fall 2021</h3>
          <figure id="fall21">
            <img
              src="../assets/images/winner-fall21.jpg"
              alt="Winner Kyle Villa poses for a photo with the Port of Mars development team, all wearing Port of Mars black t-shorts and standing on a virtual Mars background"
            />
            <figcaption>
              Evan Covington and Kyle Villa tied for the first place in that game and both received
              100 grams of Bondoc meteor fragments.
            </figcaption>
          </figure>
        </section>
        <section>
          <h3>Spring 2021</h3>
          <figure>
            <img
              src="../assets/images/winner-spring21.png"
              alt="NASA astronaut Cady Coleman on Zoom with the Port of Mars winning team"
            />
            <figcaption>
              In a nail-biting finale, two players (Curator and Researcher) emerged as winners. The
              championship team were awarded a virtual dinner with NASA astronaut Cady Coleman (<a
                href="https://www.instagram.com/astro_cady"
                title="Instagram"
                >Instagram
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon icon-tabler icon-tabler-brand-instagram"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="#aa2a29"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <rect x="4" y="4" width="16" height="16" rx="4" />
                  <circle cx="12" cy="12" r="3" />
                  <line x1="16.5" y1="7.5" x2="16.5" y2="7.501" /></svg
              ></a>
              <a href="https://twitter.com/Astro_Cady" title="Twitter"
                >Twitter
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon icon-tabler icon-tabler-brand-twitter"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="#aa2a29"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path
                    d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c-.002 -.249 1.51 -2.772 1.818 -4.013z"
                  /></svg></a
              >).
            </figcaption>
          </figure>
        </section>
      </section>
      <section id="news">
        <h2>News</h2>
        <!--Insert Instagram widget, in the meantime, I've added them manually-->
        <img
          src="../assets/images/news-Getting-There.png"
          alt="Port of Mars: Getting there is hard, getting along is harder."
        />
        <video controls>
          <source src="../assets/images/news-Only-50_-Survive.mp4" type="video/mp4" />
          Sorry, your browser doesn't support embedded videos.
        </video>
        <video controls>
          <source src="../assets/images/news-space-now-open.mp4" type="video/mp4" />
          Sorry, your browser doesn't support embedded videos.
        </video>
        <a href="https://www.instagram.com/portofmars/" title="Go to Instagram">See More</a>
      </section>
      <section id="gameplay">
        <h2>Gameplay</h2>
        <section id="objective">
          <div>
            <h3>The Objective</h3>
            <p>
              Your mission is to stay alive and achieve the most victory points. Each round you
              receive 10 time blocks that you can invest in system health or accomplishments. System
              health will maintain the shared infrastructure (upkeep) and keep the team alive.
              Accomplishments will earn you victory points.
            </p>
          </div>
          <div>
            <iframe
              title="vimeo-player"
              src="https://player.vimeo.com/video/642036661?h=2295c303de"
              width="640"
              height="360"
              allowfullscreen
            ></iframe>
          </div>
        </section>
      </section>
    </main>
    <footer>
      <section id="footer-nav">
        <h2>Navigation</h2>
        <ul>
          <li>
            <a href="#about" title="about"
              >About
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-link"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="#ffffff"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5" />
                <path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5" /></svg
            ></a>
          </li>
          <li>
            <a href="#leaderboard" title="leaderboard"
              >Leaderboard
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-link"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="#ffffff"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5" />
                <path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5" /></svg
            ></a>
          </li>
          <li>
            <a href="#news" title="news"
              >News
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-link"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="#ffffff"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5" />
                <path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5" /></svg
            ></a>
          </li>
          <li>
            <a href="#gameplay" title="gameplay"
              >Gameplay
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-link"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="#ffffff"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5" />
                <path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5" /></svg
            ></a>
          </li>
        </ul>
      </section>
      <section id="sponsors">
        <h2>Sponsors</h2>
        <ul>
          <li>
            <a href="https://interplanetary.asu.edu/" title="ASU Interplanetary Initiative"
              >ASU Interplanetary Initiative
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-external-link"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="#ffffff"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M11 7h-5a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-5" />
                <line x1="10" y1="14" x2="20" y2="4" />
                <polyline points="15 4 20 4 20 9" /></svg
            ></a>
          </li>
          <li>
            <a href="https://complexity.asu.edu/" title="ASU School of Complex Adaptive Systems"
              >ASU School of Complex Adaptive Systems
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-external-link"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="#ffffff"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M11 7h-5a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-5" />
                <line x1="10" y1="14" x2="20" y2="4" />
                <polyline points="15 4 20 4 20 9" />
              </svg>
            </a>
          </li>
          <li>
            <a href="https://www.nsf.gov/" title="US National Science Foundation"
              >US National Science Foundation (SES-2049553)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-external-link"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="#ffffff"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M11 7h-5a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-5" />
                <line x1="10" y1="14" x2="20" y2="4" />
                <polyline points="15 4 20 4 20 9" /></svg
            ></a>
          </li>
        </ul>
      </section>
      <section id="social-media">
        <h2>Social Media Links</h2>
        <ul>
          <li>
            <a href="mailto:portofmars@asu.edu" title="email us"
              >Email
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-at"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="#ffffff"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <circle cx="12" cy="12" r="4" />
                <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0v-1.5a9 9 0 1 0 -5.5 8.28" /></svg
            ></a>
          </li>
          <li>
            <a href="https://www.instagram.com/portofmars/" title="Instagram"
              >Instagram
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-brand-instagram"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="#ffffff"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <rect x="4" y="4" width="16" height="16" rx="4" />
                <circle cx="12" cy="12" r="3" />
                <line x1="16.5" y1="7.5" x2="16.5" y2="7.501" /></svg
            ></a>
          </li>
          <li>
            <a href="https://twitter.com/PortOfMars" title="Twitter"
              >Twitter
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-brand-twitter"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="#ffffff"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c-.002 -.249 1.51 -2.772 1.818 -4.013z"
                /></svg
            ></a>
          </li>
        </ul>
      </section>
      <div id="copyright">
        <small>&copy; 2020-2022 Arizona Board of Regents</small>
      </div>
    </footer>
  </b-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component
export default class extends Vue {}
</script>

<style scoped>
@import url("../stylesheets/style.css");
</style>
