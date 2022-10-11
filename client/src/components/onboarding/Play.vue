<template>
  <b-container>
    <b-row>
      <b-col class="text-center">
        <h1>All Done!</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="text-center">
        <b-button variant="warning" size="lg" @click="$emit('completed')" block>Join a Game</b-button>
      </b-col>
      <b-col class="text-center">
        <b-button variant="success" size="lg" @click="$emit('completed')" block>Start a New Game</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class Play extends Vue {

}
</script>

<style lang="scss" scroped>

</style>
