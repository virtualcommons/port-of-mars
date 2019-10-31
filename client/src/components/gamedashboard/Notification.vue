<template>
  <div class="notification">
    <p class="notification-message">The Invest phase has started. Spend those timeblocks wisely!</p>
    <!-- will be updated on props -->
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component

export default class Notification extends Vue {}
</script>

<style scoped>
.notification {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 5rem;
  background-color: #C67B5C;
  border-radius: 1rem;
  margin: 1rem 0;
  padding: 0.75rem;
}

.notification-message {
  font-size: 0.75rem;
  margin: 0;
}

</style>
