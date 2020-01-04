<template>
  <!-- SELECT_PURCHASED_ACCOMPLISHMENT -->
  <div
    v-if="eventView === 'SELECT_PURCHASED_ACCOMPLISHMENT'"
    class="event-select-purchased-accomplishment-container"
  >
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
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ResourceAmountData, Resource, Role } from 'shared/types';
import CardAccomplishment from '@/components/gamedashboard/cards/CardAccomplishment.vue';

@Component({
  components: {
    CardAccomplishment
  }
})
export default class EventAccomplishments extends Vue {
  @Prop({ default: '' }) private eventView!: string;
  // SELECT_PURCHASED_ACCOMPLISHMENT

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
@import '@/stylesheets/gamedashboard/events/EventAccomplishments.scss';
</style>
