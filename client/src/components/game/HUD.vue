<template>
  <b-container fluid class="h-100 py-5 m-0 flex-column justify-content-start align-items-center">
    <b-row class="h-100 w-auto p-0 m-0">
      <b-col cols="6" class="h-100 left pb-1">
        <HUDLeft />
      </b-col>
      <b-col cols="6" class="h-100 right pb-1">
        <HUDRight />
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator';
import HUDLeft from '@port-of-mars/client/components/game/HUDLeft.vue';
import HUDRight from '@port-of-mars/client/components/game/HUDRight.vue';

@Component({
  components: {
    HUDLeft,
    HUDRight,
  },
})
export default class HUD extends Vue {}
</script>

<style lang="scss" scoped>
.left  {
  border-left: 0.2rem solid $light-shade-25;
  border-right: 0.2rem solid $light-shade-25;
}

.right {
  border-right: 0.2rem solid $light-shade-25;
}
</style>
