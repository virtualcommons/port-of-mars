<template>
  <div v-if="messages.length > 0" id="messages-wrapper" class="lead w-100">
    <!-- MESSAGES -->
    <b-alert
      v-for="dm in messages"
      :key="dm.message"
      :variant="dm.kind"
      class="mb-0"
      dismissible
      fade
      show
    >
      {{ dm.message }}
    </b-alert>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Messages extends Vue {
  get messages() {
    return this.$tstore.state.dashboardMessages;
  }
}
</script>

<style lang="scss" scoped>
#messages-wrapper {
  z-index: 1030;
}
</style>
