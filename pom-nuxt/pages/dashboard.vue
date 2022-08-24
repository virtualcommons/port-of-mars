<script setup lang="ts">
import { ref } from "vue";

const tutorialVideoUrl = ref("https://player.vimeo.com/video/642036661");
</script>
<template>
  <main>
    <div class="flex items-stretch w-full h-screen p-3">
      <div
        class="grid grid-flow-row md:grid-rows-3 md:grid-flow-col gap-3 w-full h-full"
      >
        <!-- messages-->
        <div
          class="flex flex-col items-center row-span-1 md:col-span-1 p-5 bg-amber-900/20"
        >
          <h3>Messages</h3>
        </div>

        <div
          class="flex flex-col items-center row-span-1 md:col-span-1 gap-2 bg-amber-900/20"
        >
          <h3>Onboarding Tasks</h3>
          <base-card
            :title="'Verify Email'"
            :status="'complete'"
            :initial-color="'success'"
          ></base-card>
          <base-card
            :title="'Consent Form'"
            :status="'complete'"
            :initial-color="'success'"
          ></base-card>
          <base-card
            :title="'Watch Tutorial'"
            :status="'incomplete'"
            :initial-color="'warning'"
          ></base-card>
        </div>
        <div
          class="flex flex-col items-center row-span-1 col-span-1 gap-2 bg-amber-900/30"
        >
          <h3>Schedule</h3>
          <base-card
            :title="'Game 1'"
            :subtitle="'September 01, 2022 11AM'"
            :status="'online'"
            :initial-color="'success'"
          ></base-card>
          <base-card
            :title="'Game 2'"
            :subtitle="'September 02, 2022 11AM'"
            :status="'offline'"
            :initial-color="'warning'"
          ></base-card>
        </div>

        <!-- play game or next game countdown -->
        <div
          class="flex flex-col justify-center items-center row-span-1 md:col-span-2 p-5 bg-amber-900/20"
        >
          <h1>Next Game</h1>
          <p class="font-semibold text-black text-5xl">23: 01 : 33 : 89</p>
        </div>
        <div
          class="flex flex-col items-center row-span-2 md:col-span-2 bg-amber-900/40"
        >
          <h3>Tutorial</h3>
          <iframe
            :src="tutorialVideoUrl"
            width="600"
            height="600"
            frameborder="0"
            webkitallowfullscreen
            mozallowfullscreen
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </main>
</template>
