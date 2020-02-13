<template>
  <div class="container-purchase tour-purchase">
    <div class="purchase-row">
      <div class="info">
        <div class="topbar">
          <p>Purchase</p>
        </div>
        <div class="content tour-purchase-header">
          <p class="note">Note</p>
          <p>
            During this phase you can purchase any available accomplishments
            with your current resource investments.
          </p>
        </div>
      </div>
      <div class="actions">
        <div class="outer-wrapper">
          <div class="wrapper">
            <BarAccomplishment
              v-for="accomplishment in purchasableAccomplishments"
              :key="accomplishment.label + 2"
              :accomplishment="accomplishment"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import BarAccomplishment from '@/components/gamedashboard/global/cards/BarAccomplishment.vue';
import { canPurchaseAccomplishment } from 'shared/validation';
import { AccomplishmentData } from 'shared/types';

@Component({
  components: {
    BarAccomplishment
  }
})
export default class ContainerPurchase extends Vue {
  get purchasableAccomplishments() {
    return this.$store.getters.player.accomplishment.purchasable
      .slice()
      .sort((a: AccomplishmentData, b: AccomplishmentData) => {
        return (
          Number(
            canPurchaseAccomplishment(b, this.$store.getters.player.inventory)
          ) -
          Number(
            canPurchaseAccomplishment(a, this.$store.getters.player.inventory)
          )
        );
      });
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/containers/ContainerPurchase.scss';
</style>
