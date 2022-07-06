<template>
  <b-container fluid class="h-100 m-0 p-0 backdrop"> </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Header from "@port-of-mars/client/components/global/Header.vue";
import Footer from "@port-of-mars/client/components/global/Footer.vue";

@Component({
  components: {
    Header,
    Footer
  }
})
export default class Admin extends Vue {}
</script>
