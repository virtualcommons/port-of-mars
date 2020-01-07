<template>
  <div class="event-select-purchased-accomplishment-container">
    <div class="event-select-purchased-accomplishment">
      <CardAccomplishment v-for="acc in purchasableAccomplishments" :accomplishment="acc" />
      <CardAccomplishment v-for="acc in purchasableAccomplishments" :accomplishment="acc" />
      <!-- <CardAccomplishment
        v-for="accomplishment in boughtAccomplishments"
        :key="accomplishment.id"
        :accomplishment="accomplishment"
      /> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import CardAccomplishment from '@/components/gamedashboard/global/cards/CardAccomplishment.vue';

@Component({
  components: {
    CardAccomplishment
  }
})
export default class AccomplishmentsSelectPurchased extends Vue {
  // ACCOMPLISHMENT_SELECT_PURCHASED

  get boughtAccomplishments() {
    return this.$store.getters.player.accomplishment.bought;
  }

  get purchasableAccomplishments() {
    return this.$store.getters.player.accomplishment.purchasable;
  }

  // need to handle click events
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/events/views/AccomplishmentsSelectPurchased.scss';
</style>
