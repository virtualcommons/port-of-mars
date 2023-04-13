<template>
  <b-row>
    <b-col>
      <h4>
        <!--<b-badge :variant="status === 'Victory' ? 'success' : 'danger'">{{ status }}</b-badge>-->
        <!-- Round {{ playerStatItem.round }} -->
        <!-- <span class="float-right">{{ dateString }}</span> -->
        <!--FIXME:float to the right --><b-badge>{{ dateString }} </b-badge>
      </h4>
      <b-list-group horizontal>
        <b-list-group-item variant="light">
          <b-badge pill :variant="status === 'Victory' ? 'success' : 'danger'"
            >{{ status }}
          </b-badge>
        </b-list-group-item>
        <b-list-group-item
          v-for="playerScore in playerStatItem.playerScores"
          :key="playerScore.role"
          class="d-flex flex-fill justify-content-between align-items-center"
          variant="light"
        >
          <span class="score">
            {{ playerScore.role }}
            <template v-if="playerScore.isSelf">(YOUR ROLE)</template>
          </span>
          <span class="score mx-2">
            <b-badge pill :variant="getVariant(playerStatItem.victory, playerScore.winner)"
              >{{ playerScore.points }} points</b-badge
            >
          </span>
        </b-list-group-item>
        <b-list-group-item variant="light">
          <span class="float-right">{{ timeString }}</span>
        </b-list-group-item>
      </b-list-group>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import * as types from "@port-of-mars/shared/types";

@Component({})
export default class PlayerStatItem extends Vue {
  @Prop() private playerStatItem!: types.PlayerStatItem;

  get dateString(isSame: boolean) {
    const date = new Date(this.playerStatItem.time);
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const day = days[date.getDay()];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = months[date.getMonth()];
    const dateNum = date.getDate();
    const year = date.getFullYear();
    const correctFormat = day + " " + month + " " + dateNum + ", " + year;
    return correctFormat;
  }

  get timeString() {
    const date = new Date(this.playerStatItem.time);
    const hours = date.getHours();
    const min = date.getMinutes();
    const correctFormat = hours + ":" + min;
    return correctFormat;
  }

  getActive(victory: boolean, winner: boolean) {
    return victory && winner;
  }

  getVariant(victory: boolean, winner: boolean) {
    return victory && winner ? "success" : "secondary";
  }

  get status() {
    return this.playerStatItem.victory ? "Victory" : "Defeat";
  }
}
</script>
<style scoped>
.score {
  font-size: 1.2rem;
}
</style>
