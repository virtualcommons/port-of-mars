<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Synthetic from '../tutorial/syntheticdata';

@Component({})
export default class Master extends Vue {
  private data = new Synthetic();

  private role: string = this.data.player;

  private round: number = this.data.round;

  private costs: object = this.data.roundCosts;

  private activeAccomplishments: object[] = this.data.activeAccomplishments;

  private activeEvents = this.data.eventsThisRound;

  private roundIndex = 0;

  private roundDefinitions = [
    {
      phaseName: 'Upkeep',
      roundAction: this.phaseUpkeep,
    },
    {
      phaseName: 'Time Blocks',
      roundAction: null,
    },
    {
      phaseName: 'Trading',
      roundAction: null,
    },
    {
      phaseName: 'Purchase Accomplishments',
      roundAction: null,
    },
  ]

  constructor() {
    super();
    // console.log(this.costs);
    this.$store.dispatch('setPlayerRole', this.role);
    this.$store.dispatch('updateRoundCosts', this.costs);
    this.$store.dispatch('updatePhase', 'Pregame');
  }

  onKeyDown(e: any) {
    this.round = 0;
    if (e.key === 'r') {
      this.phaseHandler(this.roundDefinitions[this.roundIndex]);
      this.roundIndex += 1;

      if (this.roundIndex >= this.roundDefinitions.length) {
        this.roundIndex = 0;
      }
    }
  }

  mounted() {
    document.onkeydown = this.onKeyDown;
  }

  // Events:
  // 1) Upkeep
  //      Event
  //      Accomplishment Cards
  // 2) Time blocks
  //      Discussion
  //      Lock in time
  // 3) Trading
  // 4) Purchase accomplishments
  // end round

  phaseHandler(roundInformation:any) {
    this.$store.dispatch('updatePhase', roundInformation.phaseName);
    if (roundInformation.roundAction !== null) {
      roundInformation.roundAction();
    }
  }

  phaseUpkeep() {
    // get new events for the round
    this.activeEvents = this.data.eventsThisRound;
    this.$store.dispatch('updateRoundEvents', this.activeEvents);

    // update the accomplishments
    this.activeAccomplishments = this.data.activeAccomplishments;
    this.$store.dispatch('setActiveAccomplishments', this.activeAccomplishments).then(() => {
      this.$root.$emit('udpateAccomplishments', 'dummyData');
    });

    // update the mars log
    this.$store
      .dispatch('changeUpkeepAmount', 25)
      .then(() => {
        this.$store.dispatch('setNotificationMessage', '-25 Upkeep');
      })
      .then(() => {
        this.$root.$emit('notification', '-25 Upkeep');
      });
  }

  // phaseTimeBlocks() {

  // }

  // phaseTrading() {

  // }

  // phasePurchaseAccomplishments() {

  // }
}
</script>
