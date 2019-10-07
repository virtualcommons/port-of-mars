<template>
    <div class="lobby-capacity-container">
      <h2 class="lobby-capacity-status">3 PLAYERS</h2>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component

export default class WaitingLobbyCapacity extends Vue {
}
</script>

<style scoped>
  .lobby-capacity-container {
    background: inherit;
    text-align: center;
    position: absolute;
    top: 75%;
  }

  .lobby-capacity-status {
    color: white;
    font-size: 20px;
  }
</style>
