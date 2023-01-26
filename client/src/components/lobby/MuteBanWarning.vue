<template>
  <b-alert v-if="isBanned" show variant="danger" class="w-100 text-left">
    <h4 class="alert-heading">Warning</h4>
    <p>
      Your account has been disabled in response to violations of the
      <a href="https://github.com/virtualcommons/port-of-mars/wiki/Port-of-Mars-Chat-Code-of-Conduct" class="alert-link">
        Code of Conduct</a>. You will not be able to partipate in any future games.
    </p>
    <hr class="my-2">
    <p class="mb-0">
      If you believe this was done in error, please <a href="mailto:portmars@asu.edu" class="alert-link">let us know</a>.
    </p>
  </b-alert>
  <b-alert v-else-if="isMuted" show variant="warning" class="w-100 text-left">
    <h4 class="alert-heading">Warning</h4>
    <p>
      You have been muted for 3 days in response to a violation of the
      <a href="https://github.com/virtualcommons/port-of-mars/wiki/Port-of-Mars-Chat-Code-of-Conduct" class="alert-link">
        Code of Conduct</a>. You will not be able to send chat messages in game.
    </p>
    <hr class="my-2">
    <p class="mb-0">
      If you believe this was done in error, please <a href="mailto:portmars@asu.edu" class="alert-link">let us know</a>.
    </p>
  </b-alert>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class MuteBanWarning extends Vue {
  get isMuted() {
    return this.$store.state.user.isMuted;
  }

  get isBanned() {
    return this.$store.state.user.isBanned;
  }
}
</script>

<style lang="scss" scoped>
</style>
