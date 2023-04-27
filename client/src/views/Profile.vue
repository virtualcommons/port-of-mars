<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 backdrop overflow-auto">
    <div id="profile-form-container" class="w-100 mx-auto my-5">
      <ProfileForm></ProfileForm>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ProfileForm from "@port-of-mars/client/components/global/ProfileForm.vue";

@Component({
  components: { ProfileForm },
})
export default class App extends Vue {}
</script>
<style lang="scss" scoped>
#profile-form-container {
  max-width: 1200px;
}
</style>
