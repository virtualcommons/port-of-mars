<template>
  <b-container fluid>
    <b-row class="mb-3">
      <b-col>
        <b-embed
          type="iframe"
          aspect="21by9"
          :src="tutorialVideoUrl"
          allowFullscreen
        ></b-embed>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="text-right">
        <b-button variant="primary" size="lg" @click="$emit('completed')">Continue</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class Verify extends Vue {
  tutorialVideoUrl = "https://player.vimeo.com/video/642036661";
}
</script>

<style lang="scss" scroped>

</style>
