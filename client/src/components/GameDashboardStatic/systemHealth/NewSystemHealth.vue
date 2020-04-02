<template>
    <div class="top">
      <p class="title">System Health</p>
      <StatusBar class="statusbar" :setWidth="`${systemHealthStatus}`" />
      <p class="status">{{ systemHealthStatus }}<span>%</span></p>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import StatusBar from './StatusBar.vue';

@Component({
  components: {
    StatusBar,
  }
})
export default class NewSystemHealth extends Vue {
  get systemHealthStatus() {
    return this.$tstore.state.upkeep;
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/GameDashboardStatic/systemHealth/NewSystemHealth.scss';
</style>