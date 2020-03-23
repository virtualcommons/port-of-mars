<template>
  <div class="c-phasecontainer row">
    <div class="content">
      <!-- THIS IS WHERE WE SWAP BOARD BASED ON PHASE -->
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {}
})
export default class NewPhaseContainer extends Vue {}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/bottom/containers/NewPhaseContainer.scss';
</style>
