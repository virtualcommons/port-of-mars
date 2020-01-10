<template>
  <div class="container-discard">
    <div class="discard-row">
      <div class="info">
        <div class="topbar">
          <p>Information</p>
        </div>
        <div class="content">
          <p class="name">Discard Available Accomplishments (Optional)</p>
          <p class="effect">
            Click on the title of the accomplishment(s) that you would like to
            discard. The discarded accomplishments will be replaced with newly
            drawn ones next round.
          </p>
        </div>
      </div>
      <div class="actions">
        <button
          v-for="accomplishment in purchasableAccomplishments"
          :key="accomplishment.id"
          @click="handleDiscardAccomplishment(accomplishment)"
          type="button"
          name="Discard Accomplishment"
        >
          {{ accomplishment.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class ContainerDiscard extends Vue {
  get purchasableAccomplishments() {
    let purchasable = this.$store.getters.player.accomplishment.purchasable;
    return purchasable;
  }

  private handleDiscardAccomplishment(a: any) {
    this.$root.$emit('openModalConfirmation', {
      text: `Selecting \"Yes\" will discard the accomplishment \"${a.label}\" and a new card will be drawn next round.`,
      type: 'discardAccomplishment',
      actionData: a.id
    });
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/containers/ContainerDiscard.scss';
</style>
