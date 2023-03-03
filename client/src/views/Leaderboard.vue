<template>
  <p>Hello world I am a leaderboard</p>
  <div>
    <b-table striped hover :items="items"></b-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Leaderboard extends Vue {}
</script>

<style lang="scss" scoped></style>
