<template>
    <div class="top">
      <p class="title">System Health</p>
      <StatusBar class="statusbar" :setWidth="`${systemHealthStatus}`" />
      <p class="status">{{ systemHealthStatus }}<span>%</span></p>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import StatusBar from '@port-of-mars/client/components/newGameDashboard/global/StatusBar.vue';

@Component({
  components: {
    StatusBar,
  }
})
export default class NewGameBoardTop extends Vue {
  get systemHealthStatus() {
    return this.$tstore.state.upkeep;
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/top/containers/NewSystemHealth.scss';
</style>