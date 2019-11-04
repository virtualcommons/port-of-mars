<template>
  <div class="asset-exchange-input">
    <div class="asset-exchange-input-img">
      <!-- Note: need to render image assets -->
      <i class="fas fa-spinner fa-2x"></i>
    </div>
    <div class="asset-exchange-input-field">
      <input type="number" name="" placeholder="0" />
      <!-- this should have a min (0) and max (asset limit) value -->
      <p>
        /<span class="asset-exchange-input-field-inventory">{{ inventory }}</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class AssetExchangeInput extends Vue {
  @Prop({ default: 0 }) private inventory!: number;
}
</script>

<style scoped>
.asset-exchange-input {
  width: 4rem;
  margin-right: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.asset-exchange-input-img {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.asset-exchange-input-field {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.asset-exchange-input-field input {
  height: 2rem;
  width: 50%;
  border: 0.125rem solid #c67b5c;
  border-radius: 0.5rem;
  text-align: center;
  color: #f5f5f5 !important;
  background: none;
}

.asset-exchange-input-field input:focus {
  outline: none;
}

.asset-exchange-input-field input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.asset-exchange-input-field input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.asset-exchange-input-field p {
  margin: 0;
}

.asset-exchange-input-field-inventory {
  color: #c67b5c;
}
</style>
