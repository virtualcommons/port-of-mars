<template>
  <div class="container-discard">
    <div class="discard-row">
      <div class="info">
        <div class="topbar">
          <p>Discard</p>
        </div>
        <div class="content">
          <p class="name">Discard Available Accomplishments (Optional)</p>
          <p class="effect">
            Click on the title of the accomplishment(s) that you would like to
            discard. The discarded accomplishments will be replaced with newly
            drawn ones next round. This action is permanent.
          </p>
        </div>
      </div>
      <div class="actions">
        <BarDiscard v-for="accomplishment in purchasableAccomplishments"
          :key="accomplishment.id"
          :accomplishment="accomplishment"/>
        <div class="info-text" v-show="purchasableAccomplishments.length != 3">
          <p>{{`You will be delt ${3-purchasableAccomplishments.length} new card(s) next round`}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import BarDiscard from '@/components/gamedashboard/global/cards/BarDiscard.vue';

@Component({
  components:{
    BarDiscard
  }
})
export default class ContainerDiscard extends Vue {
  get purchasableAccomplishments() {
    let purchasable = this.$store.getters.player.accomplishment.purchasable;
    return purchasable;
  }

}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/containers/ContainerDiscard.scss';
</style>
