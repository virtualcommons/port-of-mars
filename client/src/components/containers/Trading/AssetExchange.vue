<template>
  <div class="asset-exchange">
    <div class="asset-exchange-img">
      <i class="fas fa-spinner fa-2x"></i>
    </div>
    <p class="asset-exchange-output">
      <span class="asset-exchange-output-requested">0</span>/<span
        class="asset-exchange-output-available"
        >2</span
      >
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class AssetExchange extends Vue {}
</script>

<style lang="css" scoped>
.asset-exchange {
  width: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* background-color: pink; */
  margin-right: 1rem;
}

.asset-exchange-img {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.asset-exchange-output {
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 0;
  text-align: center;
}

.asset-exchange-output-requested {
  color: #F5F5F5;
}

.asset-exchange-output-available {
  color: #C67B5C;
}
</style>
