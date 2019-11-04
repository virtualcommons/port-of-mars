<template>
  <div class="asset-request">
    <div class="asset-request-img">
      <!-- Note: need to render image assets -->
      <i class="fas fa-spinner fa-2x"></i>
    </div>
    <p class="asset-request-value">{{ value }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})

export default class AssetRequest extends Vue {
  @Prop({ default: 0 }) private value!: number;
}
</script>

<style lang="css" scoped>
.asset-request {
  width: 4rem;
  margin-right: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.asset-request-img {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.asset-request-value {
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 0;
  text-align: center;
  color: #F5F5F5;
}
</style>
