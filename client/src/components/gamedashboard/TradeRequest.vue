<template>
  <div class="trade-request">
    <p>This is where to make the trades.</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class TradeRequest extends Vue {}
</script>

<style scoped>
.trade-request {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--space-white-opaque-1);
}

.trade-request p {
  border-bottom: 0.125rem solid var(--space-orange);
}
</style>
