<template>
  <b-container>
    <h2>Thanks to our sponsors</h2>
    <b-row align-v="center" align-h="center">
      <img :src="$getAssetUrl(`sponsors/compute_canada.png`)" alt="Compute Canada" />
      <img
        :src="$getAssetUrl(`sponsors/asu_gbci.png`)"
        alt="ASU Global Biosocial Complexity Initiative"
      />
      <img
        :src="$getAssetUrl(`sponsors/asu_interplanetary_initiative.png`)"
        alt="ASU Interplanetary Initiative"
      />
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Sponsors extends Vue {}
</script>

<style scoped>
img {
  height: 30%;
  width: 30%;
}
</style>
