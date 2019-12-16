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

<style scoped>
/* SELECT_PURCHASED_ACCOMPLISHMENT */

.event-select-purchased-accomplishment-container {
  height: 100%;
  width: calc(calc(100 / 9) * 5%);
  background-color: blue;
}

.event-select-purchased-accomplishment {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  background-color: green;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

.event-select-purchased-accomplishment::-webkit-scrollbar {
  /* WebKit */
  height: 0;
  width: 0;
}
</style>
