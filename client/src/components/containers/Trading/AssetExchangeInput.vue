<template>
  <div class="asset-exchange-input">
    <div class="asset-exchange-input-img">
      <i class="fas fa-spinner fa-2x"></i>
    </div>
    <div class="asset-exchange-input-input">
      <input type="number" name="">
      <!-- this should have a min (0) and max (asset limit) value -->
      <p>/2</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})

export default class AssetExchangeInput extends Vue {}
</script>

<style scoped>
.asset-exchange-input {
  width: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* background-color: black; */
  margin-right: 1rem;
}

.asset-exchange-input-img {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.asset-exchange-input-input {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.asset-exchange-input-input p {
  margin: 0;
}

.asset-exchange-input-input input {
  height: 2rem;
  width: 50%;
  border: 0.125rem solid #C67B5C;
  border-radius: 0.5rem;
  color: #F5F5F5 !important;
  background: none;
  text-align: center;
}

.asset-exchange-input-input input:focus {
  outline: none;
}

.asset-exchange-input-input input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.asset-exchange-input-input input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
