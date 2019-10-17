<template>
  <div class="container-left">
    <div class="placeholder">
      <!-- will eventually remove -->
    </div>
    <MarsLog />
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';
import MarsLog from '@/components/MarsLog.vue';

@Component({
  components: {
    MarsLog,
  },
})

export default class ContainerLeft extends Vue {}
</script>

<style scoped>
.placeholder {
  height: 50%;
  background-color: purple;
}
.container-left {
  height: 100%;
  width: 100%;
  padding: 1rem 0rem 1rem 1rem;
}
</style>
