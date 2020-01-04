<template>
  <div class="container-upkeep v-step-0 v-step-1">
    <p class="title">Upkeep</p>
    <StatusBar class="statusbar" :setWidth="`${upkeepStatus}`" />
    <p>{{ upkeepStatus }}<span> %</span></p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import StatusBar from '@/components/gamedashboard/StatusBar.vue';

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
@import '@/stylesheets/gamedashboard/containers/ContainerUpkeep.scss';
</style>
