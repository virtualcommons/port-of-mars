<template>
  <b-modal
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
    <template #modal-title>
      <h2>Port of Mars Mission Control</h2>
    </template>
    <div class="d-block text-left">
      <p class="lead">
        You are 1 of 5 members of Generation Zero at the <mark>Port of Mars</mark>, the first
        long-term human community on Mars. Your mission is to <b>keep the community alive</b> while
        earning individual points by <code>collecting Accomplishments</code> for the future legacy
        of Mars. Each round, you have <code>10 time blocks</code> that you can:
      </p>
      <ul>
        <li>
          <p class="lead">
            (a) invest in the maintenance of the shared infrastructure called
            <code>System Health</code>
          </p>
        </li>
        <li>
          <p class="lead">
            (b) purchase <code>Influence Resources</code> in specific disciplines:
            <b>Culture, Finance, Government, Legacy, and Science</b>.
          </p>
        </li>
      </ul>
      <h2 class="my-3">OBJECTIVES</h2>
      <ol class="lead">
        <li>
          <code>System Health</code> is needed to keep everyone alive. If
          <code>System Health</code> reaches 0, the habitat collapses, everyone dies, and the game
          is over.
        </li>
        <li>
          Invest your time blocks or trade to earn <code>Influence Resources</code> and use them to
          purchase <code>Accomplishments</code>to win the game. You earn
          <code>Victory Points</code> for each <code>Accomplishment</code> that you purchase. Be the
          player with the most points at the end of the game to win.
        </li>
      </ol>

      <b-button
        size="lg"
        block
        squared
        @click="$bvModal.hide('bv-modal')"
        type="button"
        name="button"
      >
        Continue
      </b-button>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Component, Vue, Emit } from "vue-property-decorator";
import { BModal, BButton } from "bootstrap-vue";

@Component({
  components: {
    BModal,
    BButton,
  },
})
export default class TourModal extends Vue {
  variants = ["primary", "secondary", "success", "warning", "danger", "info", "light", "dark"];

  headerBgVariant: string = "dark";
  headerTextVariant: string = "light";
  bodyBgVariant: string = "dark";
  bodyTextVariant: string = "light";

  /**
   * Emits a custom event on hide.
   */
  @Emit("hide")
  hideModal() {
    this.$emit("hide");
  }

  @Emit("show")
  showModal() {
    this.$emit("show-modal");
  }
}
</script>

<style lang="scss" scoped>
@import "@port-of-mars/client/stylesheets/tutorial/TourModal.scss";
</style>
