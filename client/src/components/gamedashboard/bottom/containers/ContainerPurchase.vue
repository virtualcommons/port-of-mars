<template>
  <div class="container-purchase">
    <div class="purchase-row">
      <div class="info">
        <div class="topbar">
          <p>Purchase</p>
        </div>
        <div class="content">
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
@Component({
  components: {
    BarAccomplishment
  }
})
export default class ContainerPurchase extends Vue {
  get purchasableAccomplishments() {
    return this.$store.getters.player.accomplishment.purchasable;
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/containers/ContainerPurchase.scss';
</style>
