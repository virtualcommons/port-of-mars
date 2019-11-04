<template>
  <div class="asset-request-input">
    <div class="asset-request-input-img">
      <i class="fas fa-spinner fa-2x"></i>
    </div>
    <input class="asset-request-input-field" type="number" name="" placeholder="0" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class AssetRequestInput extends Vue {}
</script>

<style scoped>
.asset-request-input {
  width: 4rem;
  margin-right: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.asset-request-input-img {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.asset-request-input-field {
  height: 2rem;
  width: 100%;
  margin-top: 1rem;
  border: 0.125rem solid #c67b5c;
  border-radius: 0.5rem;
  text-align: center;
  color: #f5f5f5 !important;
  background: none;
}

.asset-request-input-field:focus {
  outline: none;
}

.asset-request-input-field::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.asset-request-input-field::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
