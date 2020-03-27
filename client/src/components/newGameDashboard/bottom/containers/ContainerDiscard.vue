<template>
  <div class="container-discard">
    <div class="discard-row">
      <div class="info">
        <div class="topbar">
          <p>Discard</p>
        </div>
        <div class="content">
          <p class="note">Note</p>
          <p>
            This phase is optional.<br /><br />Click on the title of the
            accomplishment(s) that you would like to discard.<br /><br />The
            discarded accomplishments will be replaced with newly drawn ones
            next round.
          </p>
        </div>
      </div>
      <div class="actions tour-discard">
        <BarDiscard
          v-for="accomplishment in purchasableAccomplishments"
          :key="accomplishment.id"
          :accomplishment="accomplishment"
        />
        <div class="info-text" v-show="purchasableAccomplishments.length != 3">
          <p>
            {{
              `You will draw ${3 - purchasableAccomplishments.length} new card(s) next round`
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import BarDiscard from '@port-of-mars/client/components/newGameDashboard/global/cards/BarDiscard.vue';

@Component({
  components: {
    BarDiscard
  }
})
export default class ContainerDiscard extends Vue {
  get purchasableAccomplishments() {
    return this.$store.getters.player.accomplishments.purchasable;
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/bottom/containers/ContainerDiscard.scss';
</style>
