<script setup lang="ts"></script>
<template>
  <main>
    <div class="flex items-stretch w-full h-full p-3">
      <div class="grid grid-rows-3 grid-flow-col gap-3 w-full h-full">
        <!-- messages-->
        <div class="row-span-1 col-span-3 p-5 text-center bg-amber-900/20">
          <h1 class="text-black">Messages</h1>
        </div>
        <div class="row-span-1 col-span-1 bg-amber-900/20">
          <h1 class="text-black">Onboarding Tasks</h1>
          <ul>
            <li>Task 1</li>
            <li>Task 2</li>
            <li>Task 3</li>
            <li>Task 4</li>
          </ul>
        </div>
        <div class="row-span-1 col-span-1 bg-amber-900/30">
          <h1 class="text-black">Schedule</h1>
        </div>
        <div class="row-span-2 col-span-2 bg-amber-900/40">Main Content</div>
      </div>
    </div>
  </main>
</template>
