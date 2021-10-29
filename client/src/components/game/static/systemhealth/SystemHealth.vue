<template>
  <b-container fluid>
    <b-row class="px-4 tour-system-health" align-v="center">
      <h3 class="title mx-3 my-auto">System Health</h3>
      <StatusBar class="statusbar" :setWidth="`${systemHealthStatus}`" />
      <h3 class="status mx-3">{{ systemHealthStatus }}<span>%</span></h3>
    </b-row>
  </b-container>
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
