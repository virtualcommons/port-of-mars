<script setup lang="ts">
import { ref } from "vue";
import { isDevOrStaging } from "@port-of-mars/shared/settings";
import { useLogin, useHome } from "composables/routes";

const login = useLogin;
const home = useHome;
const title = ref("Mission Control Dashboard");

let showMenu: boolean = false;

function toggleNav() {
  showMenu = !showMenu;
}
</script>

<template>
  <header class="w-full fixed items-center top-0 z-10 bg-black shadow-md">
    <nav class="grid grid-cols-2 lg:grid-cols-3 p-6 items-center">
      <div class="m-1.5 col-start-1 col-span-1">
        <nuxt-link :to="home">
          <img
            id="logo"
            src="assets/images/logo-Port-of-Mars-White.svg"
            alt="the planet mars illustrated in white above Port of Mars"
          />
          <h1 class="hidden">Port of Mars</h1>
        </nuxt-link>
      </div>

      <div
        class="m-1.5 md:hidden md:col-start-3 md:col-span-1 justify-self-end"
      >
        <button type="button" @click="toggleNav">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="w-6 h-6 fill-current"
            stroke="currentColor"
            strokeWidth="{2}"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          {{ showMenu }}
        </button>
      </div>
      <div class="m-1.5 col-span-full md:col-start-3 md:col-span-1">
        <ul
          class="md:flex flex-col space-y-4 mt-8 md:space-y-0 md:flex-row md:items-center md:space-x-10 md:mt-0"
        >
          <li><nuxt-link>Register</nuxt-link></li>
          <li><a href="#about" title="about">About</a></li>
          <li><a href="#winners" title="winners">Winners</a></li>
          <li><a href="#news" title="news">News</a></li>
          <li><a href="#gameplay" title="gameplay">Gameplay</a></li>
        </ul>
      </div>
    </nav>
  </header>
</template>
