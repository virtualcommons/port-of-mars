<template>
    <div class="gameplay-guide-container">
      <h2 class="gameplay-guide-content">[ GAMEPLAY GUIDE GOES HERE ]</h2>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component

export default class GameplayGuide extends Vue {
}
</script>

<style scoped>
  .gameplay-guide-container {
    background: inherit;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 80%;
  }

  .gameplay-guide-content {
    color: white;
    font-size: 20px;
  }
</style>
