<script setup lang="ts">
import Player from "@vimeo/player";

const tutorialVideoUrl = "https://player.vimeo.com/video/642036661";

function activateTutorial() {
  const iframe = document.getElementById("tutorialVideo") as HTMLIFrameElement;
  const player = new Player(iframe);
  // FIXME: currently some typescript bugs with the vimeo player ts defs
  (player as any).requestFullscreen().then(() => player.play());
  (player as any).on("ended", (data: any) => {
    console.log("Video ended");
    // this.hasWatchedTutorial = true;
    // FIXME: submit to a new API endpoint also and read it in from dashboard data
  });
}
</script>
<template>
  <main>
    <div class="flex items-stretch w-full h-screen p-3">
      <div class="grid grid-rows-3 grid-flow-col gap-3 w-full h-full">
        <!-- messages-->
        <div
          class="flex flex-col items-center row-span-1 col-span-1 p-5 bg-amber-900/20"
        >
          <h1 class="font-medium text-black leading-tight text-xl my-2">
            Messages
          </h1>
        </div>

        <div
          class="flex flex-col items-center row-span-1 col-span-1 gap-2 bg-amber-900/20"
        >
          <h1 class="font-medium text-black leading-tight text-xl my-2">
            Onboarding Tasks
          </h1>
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
          <h1 class="font-medium text-black leading-tight text-xl my-2">
            Schedule
          </h1>
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
          class="flex flex-col justify-center items-center row-span-1 col-span-2 p-5 bg-amber-900/20"
        >
          <h1 class="font-medium text-black leading-tight text-3xl">
            Next Game
          </h1>
          <p class="font-semibold text-black text-5xl">23: 01 : 33 : 89</p>
        </div>
        <div
          class="flex flex-col items-center row-span-2 col-span-2 bg-amber-900/40"
        >
          <h1 class="font-medium text-black leading-tight text-2xl my-2">
            Tutorial
          </h1>
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
