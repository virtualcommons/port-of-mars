<template>
  <b-alert class="bg-primary border-0 m-0 rounded-0" show>
    <h5 class="p-1 text-center text-white m-3">{{ text }}</h5>
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
