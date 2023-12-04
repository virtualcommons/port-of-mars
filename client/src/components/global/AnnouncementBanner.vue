<template>
  <b-alert class="bg-primary border-0 m-0 rounded-0" show>
    <div class="d-flex justify-content-center align-items-center">
      <p class="text-center text-white preserve-newline mb-0">{{ text }}</p>
    </div>
  </b-alert>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class AnnouncementBanner extends Vue {
  @Prop()
  text!: string;
}
</script>

<style lang="scss" scoped>
.preserve-newline {
  white-space: pre-line;
}
</style>
