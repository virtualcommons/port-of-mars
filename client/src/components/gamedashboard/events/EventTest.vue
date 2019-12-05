<template>
  <div class="event-test">
    <p>This is for the event view switch implementation.</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})

export default class EventTest extends Vue {}
</script>

<style scoped>
.event-test {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--space-gray);
  background-color: pink;
}

.event-test p {
  margin: 0;
}
</style>
