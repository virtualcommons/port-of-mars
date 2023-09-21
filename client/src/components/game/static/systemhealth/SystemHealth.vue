<template>
  <b-container fluid>
    <b-row class="px-4 tour-system-health" align-v="center">
      <h3 class="title mx-3 my-auto">
        <b-img
          v-bind="systemHealthIconProps"
          :src="$getAssetUrl(`icons/systemHealth.svg`)"
          rounded="circle"
          left
          class="mr-1 mt-2"
          alt="System Health"
        />
        System Health
      </h3>
      <StatusBar class="statusbar" :setWidth="systemHealth" />
      <h3 class="mx-2">
        {{ systemHealth }}
        <b-img
          v-bind="systemHealthIconProps"
          class="ml-2 mt-2"
          :src="$getAssetUrl(`icons/systemHealth.svg`)"
          right
          alt="System Health Icon"
        />
      </h3>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import StatusBar from "./StatusBar.vue";

@Component({
  components: {
    StatusBar,
  },
})
export default class SystemHealth extends Vue {
  get systemHealth() {
    return this.$tstore.state.systemHealth;
  }

  get systemHealthIconProps() {
    return {
      height: 25,
    };
  }
}
</script>
