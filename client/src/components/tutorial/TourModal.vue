<template>
  <BModal
    size="lg"
    id="bv-modal"
    centered
    title="Port of Mars Tutorial"
    no-stacking
    hide-footer
    :header-bg-variant="headerBgVariant"
    :header-text-variant="headerTextVariant"
    :body-bg-variant="bodyBgVariant"
    :body-text-variant="bodyTextVariant"
    :no-close-on-backdrop="true"
    :no-close-on-esc="true"
    :hide-header-close="true"
    @hide="hideModal"
    @show="showModal"
  >
    <template v-slot:modal-title>
      <code><b>TUTORIAL</b></code>
    </template>
    <div class="d-block text-center">
      <h2>
        <code><b>WELCOME TO PORT OF MARS!</b></code>
      </h2>
      <p>
        You are 1 of 5 members of Generation Zero at <code><b>Port of Mars</b></code>, the first long-term human
        community on Mars. Your mission is to <code><b>keep the community alive</b></code> while earning individual
        points by <code><b>achieving Accomplishments</b></code> for the future legacy of Mars. Each round, you
        have <code><b>10 timeblocks</b></code> that you can either (a) invest in the maintenance of the shared infrastructure
        called <code><b>System Health</b></code> or (b) purchase <code><b>influence</b></code> currency in specific
        disciplines: <b>Culture, Finance, Government, Legacy, and Science</b>.
      </p>

      <p>
        <code><b>System Health</b></code> is needed to keep everyone alive.
      </p>

      <p>
        <code><b>Influence</b></code> resources are used to purchase <code><b>Accomplishments</b></code>, which is how you win
        the game. You <b>earn points</b> for each <code><b>Accomplishment</b></code> that you purchase.
      </p>

      <br />

      <h4><b>OBJECTIVES</b></h4>
      <ul>
        <li>
          Keep <code><b>System Health</b></code> from reaching zero! If that happens,
          the habitat collapses, everyone dies, and the game is over.
        </li>
        <li>
          Earn points by achieving <code><b>Accomplishments</b></code>!
          Be the player with the most points at the end of the game to win.
        </li>
      </ul>

      <BButton @click="$bvModal.hide('bv-modal')" type="button" name="button">
          Next
      </BButton>
    </div>
  </BModal>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import { BModal, BButton } from 'bootstrap-vue';

@Component({
  components: {
    BModal,
    BButton
  }
})
export default class TourModal extends Vue {
  variants = [
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
    'info',
    'light',
    'dark'
  ];

  headerBgVariant: string = 'dark';
  headerTextVariant: string = 'light';
  bodyBgVariant: string = 'dark';
  bodyTextVariant: string = 'light';

  /**
   * Emits a custom event on hide.
   */
  @Emit('hide')
  hideModal() {
    this.$emit('hide');
  }

  @Emit('show')
  showModal() {
    this.$emit('show-modal');
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/tutorial/TourModal.scss';
</style>
