<template>
  <b-container fluid class="justify-content-center tour-system-health">
    <b-row align-v="center" class="m-auto">
      <h3 class="title ml-2 mr-4 my-auto">System Health</h3>
      <StatusBar class="statusbar" :setWidth="`${systemHealthStatus}`" />
      <h3 class="status mr-2 ml-4 my-auto">{{ systemHealthStatus }}<span>%</span></h3>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import StatusBar from './StatusBar.vue';

@Component({
  components: {
    StatusBar,
  },
})
export default class SystemHealth extends Vue {
  get systemHealthStatus() {
    return this.$tstore.state.systemHealth;
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/static/systemhealth/SystemHealth.scss';
</style>
