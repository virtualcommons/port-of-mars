<template>
  <div class="container-purchase tour-purchase">
    <div class="purchase-row">
      <div class="info">
        <div class="section-text">
          <p>Inventory</p>
        </div>
      </div>

      <div class="actions">
        <div class="section-text">
          <p>Active accomplishments</p>
        </div>
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

      <div class="chat-container">
        <div class="section-text">
          <p>Chat</p>
        </div>
        <div class="chat">
          <Chat/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import BarAccomplishment from '@port-of-mars/client/components/gamedashboard/global/cards/BarAccomplishment.vue';
import Chat from '@port-of-mars/client/components/gamedashboard/right/ChatRework.vue';
import { canPurchaseAccomplishment } from '@port-of-mars/shared/validation';
import { AccomplishmentData } from '@port-of-mars/shared/types';

@Component({
  components: {
    BarAccomplishment,
    Chat
  }
})
export default class ContainerPurchase extends Vue {
  get purchasableAccomplishments() {
    return this.$store.getters.player.accomplishments.purchasable
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
@import '@port-of-mars/client/stylesheets/gamedashboard/bottom/containers/ContainerPurchaseRework.scss';
</style>
