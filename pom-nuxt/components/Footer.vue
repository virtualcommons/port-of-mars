<!-- 
Footer designed by Christina Carrasquilla (ccarra1@asu.edu) for Port of Mars
Tailwind CSS optimization by Christine Nguyen (cnnguye9@asu.edu)
-->

<script setup lang="ts">
import { ref } from "vue";
// import { BUILD_ID } from "@port-of-mars/shared/settings";
// const buildId = ref(BUILD_ID);

enum Url {
  CONTACT_EMAIL = "mailto:portmars@asu.edu",
  ASU_II = "https://interplanetary.asu.edu/",
  ASU_COMPLEXITY = "https://complexity.asu.edu/",
  COMPUTE_CANADA = "https://www.computecanada.ca/",
  WEST_GRID = "https://westgrid.ca/",
  NSF = "https://www.nsf.gov/",
  INSTAGRAM = "https://www.instagram.com/portofmars/",
  TWITTER = "https://twitter.com/PortOfMars",
}
</script>

<template>
  <footer
    class="grid grid-cols-1 lg:grid-cols-6 mx-auto px-6 py-8 items-center text-xs bg-black"
  >
    <section class="m-1.5 col-span-full lg:col-start-1 lg:col-span-1">
      <h4>Navigation</h4>
      <ul>
        <li class="link">
          <a href="#about" title="about"
            >About
            <div
              class="icon inline-flex relative self-center top-0.5 h-4 w-4 mx-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
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
                  d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5"
                />
                <path
                  d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5"
                />
              </svg>
            </div>
          </a>
        </li>
        <li class="link">
          <a href="#leaderboard" title="leaderboard">Leaderboard</a>
          <div
            class="icon inline-flex relative self-center top-0.5 h-4 w-4 mx-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
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
                d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5"
              />
              <path
                d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5"
              />
            </svg>
          </div>
        </li>
        <li class="link">
          <a href="#news" title="news"
            >News
            <div
              class="icon inline-flex relative self-center top-0.5 h-4 w-4 mx-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
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
                  d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5"
                />
                <path
                  d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5"
                />
              </svg>
            </div>
          </a>
        </li>
        <li class="link">
          <a href="#gameplay" title="gameplay"
            >Gameplay
            <div
              class="icon inline-flex relative self-center top-0.5 h-4 w-4 mx-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
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
                  d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5"
                />
                <path
                  d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5"
                />
              </svg>
            </div>
          </a>
        </li>
      </ul>
    </section>
    <section class="m-1.5 col-span-full lg:col-start-3 lg:col-span-2">
      <h4>Sponsors</h4>
      <ul>
        <li class="link">
          <a
            :href="Url.ASU_II"
            title="ASU Interplanetary Initiative"
            target="_blank"
            >ASU Interplanetary Initiative
            <div
              class="icon inline-flex relative self-center top-0.5 h-4 w-4 mx-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
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
                  d="M11 7h-5a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-5"
                />
                <line x1="10" y1="14" x2="20" y2="4" />
                <polyline points="15 4 20 4 20 9" />
              </svg>
            </div>
          </a>
        </li>
        <li class="link">
          <a
            :href="Url.ASU_COMPLEXITY"
            title="ASU School of Complex Adaptive Systems"
            target="_blank"
            >ASU School of Complex Adaptive Systems
            <div
              class="icon inline-flex relative self-center top-0.5 h-4 w-4 mx-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
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
                  d="M11 7h-5a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-5"
                />
                <line x1="10" y1="14" x2="20" y2="4" />
                <polyline points="15 4 20 4 20 9" />
              </svg>
            </div>
          </a>
        </li>
        <li class="link">
          <a
            :href="Url.NSF"
            title="US National Science Foundation"
            target="_blank"
            >US National Science Foundation (SES-2049553)
            <div
              class="icon inline-flex relative self-center top-0.5 h-4 w-4 mx-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
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
                  d="M11 7h-5a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-5"
                />
                <line x1="10" y1="14" x2="20" y2="4" />
                <polyline points="15 4 20 4 20 9" />
              </svg>
            </div>
          </a>
        </li>
        <li class="link">
          <a :href="Url.COMPUTE_CANADA" title="Compute Canada" target="_blank"
            >Compute Canada</a
          >
          <span class="mx-2">and</span>
          <a :href="Url.WEST_GRID" title="West Grid" target="_blank"
            >West Grid
            <div
              class="icon inline-flex relative self-center top-0.5 h-4 w-4 mx-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
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
                  d="M11 7h-5a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-5"
                />
                <line x1="10" y1="14" x2="20" y2="4" />
                <polyline points="15 4 20 4 20 9" />
              </svg></div
          ></a>
        </li>
      </ul>
    </section>
    <section class="m-1.5 col-span-full lg:col-start-6 lg:col-span-1">
      <h4>Social Media Links</h4>
      <ul>
        <li class="link">
          <a :href="Url.CONTACT_EMAIL" title="Email Us" _target="blank"
            >Email
            <div
              class="icon inline-flex relative self-center top-0.5 h-4 w-4 mx-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
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
                <path
                  d="M16 12v1.5a2.5 2.5 0 0 0 5 0v-1.5a9 9 0 1 0 -5.5 8.28"
                />
              </svg>
            </div>
          </a>
        </li>
        <li class="link">
          <a :href="Url.INSTAGRAM" title="Instagram" target="_blank"
            >Instagram
            <div
              class="icon inline-flex relative self-center top-0.5 h-4 w-4 mx-1"
            >
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
                <line x1="16.5" y1="7.5" x2="16.5" y2="7.501" />
              </svg>
            </div>
          </a>
        </li>
        <li class="link">
          <a :href="Url.TWITTER" title="Twitter" target="_blank"
            >Twitter
            <div
              class="icon inline-flex relative self-center top-0.5 h-4 w-4 mx-1"
            >
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
                />
              </svg>
            </div>
          </a>
        </li>
      </ul>
    </section>
    <section class="m-1.5 col-span-full w-full text-center p-4">
      <p>&copy; 2020-2022 Arizona Board of Regents</p>
    </section>
  </footer>
</template>
