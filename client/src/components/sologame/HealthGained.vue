<template>
  <div class="position-relative">
    <div class="health-gained-float vfd-text-glow vfd-green" style="font-size: 3rem">
      +{{ systemHealthGained }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({})
export default class HealthGained extends Vue {
  @Prop({ default: 0 }) systemHealthGained!: number;
}
</script>

<style lang="scss" scoped>
.health-gained-float {
  position: absolute;
  left: 25%;
  top: 50%;
  opacity: 0;
  transition: all 3s ease-out;
  animation: floatUp 3s ease-out;
}

@keyframes floatUp {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-50px);
    opacity: 0;
  }
}
</style>
