<template>
  <div class="c-hud container">
    <div class="wrapper row">
      <div class="left col-6">
        <HUDLeft />
      </div>
      <div class="right col-6">
        <HUDRight />
      </div>
    </div>
  </div>
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
@import '@port-of-mars/client/stylesheets/game/HUD.scss';
</style>
