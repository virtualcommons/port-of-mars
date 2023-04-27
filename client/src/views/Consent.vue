<template>
  <b-container fluid class="h-auto m-0 p-2 bg-dark">
    <ConsentForm></ConsentForm>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ConsentForm from "@port-of-mars/client/components/global/ConsentForm.vue";

@Component({
  components: { ConsentForm },
})
export default class Consent extends Vue {}
</script>
