<template>
<b-container>
  <b-card
    header="This project would not have been successful without the support of our sponsors."
    header-bg-variant="primary"
    style="font-family: '$exo';"
    >
  <b-card-text>
    <b-row align-v="center" align-h="center">
      <img
        :src="
      require(`@port-of-mars/client/assets/sponsors/compute_canada.png`)
    "
        alt="Compute Canada"
      />
      <img
        :src="
      require(`@port-of-mars/client/assets/sponsors/asu_gbci.png`)
    "
        alt="ASU Global Biosocial Complexity Initiative"
      />
      <img
        :src="
      require(`@port-of-mars/client/assets/sponsors/asu_interplanetary_initiative.png`)
    "
        alt="ASU Interplanetary Initiative"
      />
    </b-row>
  </b-card-text>
  </b-card>
</b-container>
</template>

<script>
import {Component, Vue} from "vue-property-decorator";

@Component({})
export default class Sponsors extends Vue {}
</script>

<style scoped>
img {
  height: 30%;
  width: 30%;
}
</style>
