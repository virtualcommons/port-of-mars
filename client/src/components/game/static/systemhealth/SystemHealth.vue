<template>
  <b-row class="w-100 py-0 px-4 m-auto tour-system-health" align-v="center">
    <h3 class="title ml-2 mr-4 my-auto">System Health</h3>
    <StatusBar class="statusbar" :setWidth="`${systemHealthStatus}`" />
    <h3 class="status mr-2 ml-4 my-auto">{{ systemHealthStatus }}<span>%</span></h3>
  </b-row>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import StatusBar from "./StatusBar.vue";

@Component({
  components: {
    StatusBar
  }
})
export default class SystemHealth extends Vue {
  get systemHealthStatus() {
    return this.$tstore.state.systemHealth;
  }
}
</script>
