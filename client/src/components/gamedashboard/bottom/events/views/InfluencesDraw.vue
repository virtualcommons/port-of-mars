<template>
  <div class="event-select-influences">
    <p>Please select one influence:</p>

    <div class="event-select-influences-select">
      <div
        class="event-select-influences-select-influence"
        v-for="influence in availableInfluences"
        :key="influence"
      >
        <img
          @click="handleDrawInfluence(influence)"
          :src="require(`@/assets/icons/${influence}.svg`)"
          alt="Investment"
        />
        <!-- <p>{{ investment.units }}</p> -->
      </div>
    </div>

    <p>Chosen</p>

    <div v-if="drawnInfluence === 'None Selected'" class="selected-placeholder">
      <p>None Selected</p>
    </div>

    <div class="event-select-influences-selected" v-else-if="drawnInfluence !== 'None Selected'">
      <div class="event-select-influences-selected-influence">
        <img
          @click="handleUndrawInfluence"
          :src="require(`@/assets/icons/${drawnInfluence}.svg`)"
          alt="Investment"
        />
      </div>
    </div>

    <button type="button" name="Submit Button" @click="submitDrawnInfluence">Done</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class InfluencesDraw extends Vue {
  private drawnInfluence: string = 'None Selected';

  get availableInfluences(): Array<string> {
    return ['science', 'government', 'legacy', 'finance', 'culture'];
  }

  private handleDrawInfluence(influence: string): void {
    this.drawnInfluence = influence;
    console.log('DRAW (type): ', typeof influence);
    console.log('DRAW: ', influence);
  }

  private handleUndrawInfluence(): void {
    this.drawnInfluence = 'None Selected';
  }

  private submitDrawnInfluence(): void {
    console.log('SUBMIT DRAWN INFLUENCE: ', this.drawnInfluence);
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/events/views/InfluencesDraw.scss';
</style>
