<script setup lang="ts">
import { ref } from "vue";
import { isDevOrStaging } from "@port-of-mars/shared/settings";
import { useLogin, useHome } from "composables/routes";

const login = useLogin;
const home = useHome;
const title = ref("Mission Control Dashboard");

const showMenu = ref(false);

function toggleNav() {
  showMenu.value = !showMenu.value;
}

// const props = defineProps<{
//   foo: string;
//   bar?: number;
// }>();
//
</script>

<template>
  <header class="w-full fixed items-center top-0 z-10 bg-black shadow-md">
    <nav
      class="container px-6 py-8 mx-auto md:flex md:justify-between md:items-center"
    >
      <div class="flex items-center justify-between">
        <nuxt-link :to="home">
          <img
            id="logo"
            src="assets/images/logo-Port-of-Mars-White.svg"
            alt="the planet mars illustrated in white above Port of Mars"
          />
          <h1 class="hidden">Port of Mars</h1>
        </nuxt-link>
        <div class="flex md:hidden">
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
          </button>
        </div>
      </div>
      <ul
        :class="showMenu ? 'flex' : 'hidden'"
        class="flex-col space-y-4 mt-8 md:flex md:space-y-0 md:flex-row md:items-center md:space-x-10 md:mt-0"
      >
        <li><nuxt-link> Sign In / Register </nuxt-link></li>
        <li><a href="#about" title="about">About</a></li>
        <li><a href="#winners" title="winners">Winners</a></li>
        <li><a href="#news" title="news">News</a></li>
        <li><a href="#gameplay" title="gameplay">Gameplay</a></li>
      </ul>
    </nav>
  </header>
</template>
