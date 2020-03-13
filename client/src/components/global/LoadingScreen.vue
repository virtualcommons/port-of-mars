<template>
  <div class="loadingscreen">
    <h1>Port of Mars</h1>
    <h2 class="animated pulse slower infinite">Loading...</h2>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class LoadingScreen extends Vue {}
</script>

<style lang="scss" scoped>
@import '~animate.css/source/attention_seekers/pulse.css';
@import '@port-of-mars/client/stylesheets/global/LoadingScreen.scss';
</style>
