<template>
  <b-jumbotron>
    <template #header>404: Nothing to see here</template>
    <template #lead>
      This URL doesn't appear to go anywhere. If this is an error, please
      <a href="https://github.com/virtualcommons/port-of-mars/discussions"> let us know. </a>
    </template>
  </b-jumbotron>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class NotFound extends Vue {}
</script>
