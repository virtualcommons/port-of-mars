<template>
  <div class="waiting-lobby">
    <p>Waiting Lobby</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})

export default class WaitingLobby extends Vue {}
</script>

<style scoped>
.waiting-lobby {
  background-color: pink;
}
</style>
