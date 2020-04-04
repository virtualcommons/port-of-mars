<template>
  <div class="c-containergame w-100 h-100">
    <MasterComponent v-if="environment === 'development'" />
    <ModalContainer />
    <ModalController />
    <GameboardContainer />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { EnvironmentMode } from '@port-of-mars/client/settings';
import MasterComponent from '@port-of-mars/client/components/MasterComponent.vue';
import ModalContainer from '@port-of-mars/client/components/game/modals/ModalContainer.vue';
import ModalController from '@port-of-mars/client/components/game/modals/ModalController.vue';
import GameboardContainer from '@port-of-mars/client/components/root/GameboardContainer.vue';

@Component({
  components: {
    MasterComponent,
    ModalContainer,
    ModalController,
    GameboardContainer,
  },
})
export default class ContainerGame extends Vue {
  private env: EnvironmentMode = new EnvironmentMode();

  /**
   * Gets the string value of the current environment.
   * @return The environment.
   *
   */
  get environment() {
    return this.env.environment;
  }
}
</script>

<style lang="scss" scoped></style>
