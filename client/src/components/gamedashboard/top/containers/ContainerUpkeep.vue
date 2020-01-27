<template>
  <div class="container-upkeep tour-container-upkeep">
    <p class="title">Colony Health</p>
    <StatusBar class="statusbar" :setWidth="`${upkeepStatus}`" />
    <p>{{ upkeepStatus }}<span> %</span></p>
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
  get upkeepStatus() {
    return this.$tstore.state.upkeep;
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/top/containers/ContainerUpkeep.scss';
</style>
