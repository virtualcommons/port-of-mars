<template>
  <b-container fluid class="h-auto m-0 p-0 bg-content">
    <Messages class="position-fixed p-3"></Messages>
    <div id="consent-form-container" class="mx-auto my-5">
      <ConsentForm></ConsentForm>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ConsentForm from "@port-of-mars/client/components/global/ConsentForm.vue";
import Messages from "@port-of-mars/client/components/global/Messages.vue";

@Component({
  components: { ConsentForm, Messages },
})
export default class Consent extends Vue {}
</script>
<style lang="scss" scoped>
#consent-form-container {
  max-width: 1200px;
}
</style>
