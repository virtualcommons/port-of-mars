<template>
  <div class="container-upkeep tour-container-upkeep">
    <p class="title">System Health</p>
    <StatusBar class="statusbar" :setWidth="`${systemHealthStatus}`" />
    <p class="status">{{ systemHealthStatus }}<span> %</span></p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import StatusBar from '@/components/gamedashboard/global/StatusBar.vue';

@Component({
  components: {
    StatusBar
  }
})
export default class ContainerUpkeep extends Vue {
  get systemHealthStatus() {
    return this.$tstore.state.upkeep;
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/top/containers/ContainerUpkeep.scss';
</style>
