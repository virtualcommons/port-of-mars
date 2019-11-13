<template>
  <div class="asset-exchange">
    <div class="asset-exchange-img">
      <!-- Note: need to render image assets -->
      <i class="fas fa-spinner fa-2x"></i>
    </div>
    <p class="asset-exchange-output">
      <span class="asset-exchange-output-requested">{{ value }}</span
      >/<span class="asset-exchange-output-available">{{ inventory }}</span>
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class AssetExchange extends Vue {
  @Prop({ default: 0 }) private value!: number;

  @Prop({ default: 0 }) private inventory!: number;
}
</script>

<style scoped>
.asset-exchange {
  width: 4rem;
  margin-right: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.asset-exchange-img {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.asset-exchange-output {
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 0;
  text-align: center;
}

.asset-exchange-output-requested {
  color: var(--space-white);
}

.asset-exchange-output-available {
  color: var(--space-orange);
}
</style>
