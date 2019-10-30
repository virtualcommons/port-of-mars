<template>
  <div class="asset-request-input">
    <div class="asset-request-input-img">
      <i class="fas fa-spinner fa-2x"></i>
    </div>
    <input class="asset-request-input-input" type="number" name="">
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* background-color: black; */
  margin-right: 1rem;
}

.asset-request-input-img {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.asset-request-input-input {
  height: 2rem;
  width: 100%;
  border: 0.125rem solid #C67B5C;
  border-radius: 0.5rem;
  color: #F5F5F5 !important;
  background: none;
  text-align: center;
  margin-top: 1rem;
}

.asset-request-input-input:focus {
  outline: none;
}

.asset-request-input-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.asset-request-input-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
