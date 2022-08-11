<script setup lang="ts">
import { url } from "@port-of-mars/client/util";
</script>

<template>
  <main>
    <div class="flex justify-center items-center w-full h-screen bg-login">
      <div
        class="flex flex-col rounded-lg justify-center items-center h-4/6 w-5/6 bg-slate-900/50"
      >
        <h1
          class="font-semibold font-sans text-white leading-tight text-2xl my-2"
        >
          Sign In to Port of Mars
        </h1>
        <base-button to="/login" :initial-color="'main'">Register</base-button>
      </div>
    </div>
  </main>
</template>
