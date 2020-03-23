<template>
  <div class="profilemenu" :style="width">
    <div class="wrapper">
      <button @click="toggle" class="toggle"></button>
      <!-- <button>Option One</button> -->
      <!-- <button>Option One</button> -->
      <!-- <button>Option One</button> -->
      <!-- <button>Option One</button> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  components: {}
})
export default class ProfileMenu extends Vue {
  private visible: boolean = false;

  private toggle() {
    this.visible = !this.visible;
  }

  get width() {
    return this.visible ? { width: '20rem' } : { width: '0rem' };
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets//gamedashboard/global/ProfileMenu.scss';
</style>
