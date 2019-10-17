<template>
  <div class="marslog">
    <p class="marslog-title">Mars Log</p>
    <div class="marslog-log">

    </div>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';

@Component


export default class MarsLog extends Vue {}
</script>

<style scoped>
.marslog {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 50%;
  /* background-color: blue; */
}

.marslog-title {
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  color: #F5F5F5;
}

.marslog-log {
  height: 100%;
  border: 0.125rem solid #F5F5F5;
}
</style>
